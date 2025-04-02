import { addNewType, getTypes } from '@/lib/data';
import { google } from 'googleapis';

export async function POST(req) {

  try {
    const { type, amount, date } = await req.json();

    // Basic validation
    if (!type || amount === undefined || !date) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Connect to Google Sheets
    const sheets = await getGoogleSheetsClient();
    // Get current date info for sheet name
    const expenseDate = new Date(date);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[expenseDate.getMonth()];
    const year = expenseDate.getFullYear();
    const sheetName = `${month} ${year}`;

    // Check if the sheet exists, create if not
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    let sheetExists = false;
    for (const sheet of spreadsheet.data.sheets) {
      if (sheet.properties.title === sheetName) {
        sheetExists = true;
        break;
      }
    }

    if (!sheetExists) {
      // Create a new sheet for this month and year
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                  gridProperties: {
                    rowCount: 1000,
                    columnCount: 3
                  }
                }
              }
            }
          ]
        }
      });

      // Add headers to the new sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:C1`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [['Date', 'Type', 'Amount (₹)']]
        }
      });
    }

    // Append the expense data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:C`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[
          new Date(date).toLocaleDateString('en-IN'),
          type,
          amount.toString()
        ]]
      }
    });

    // Check if type is new, and add it to data.json if it is
    const existingTypes = await getTypes();
    if (!existingTypes.includes(type)) {
      await addNewType(type);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error submitting expense:', error);
    return Response.json({ success: false, error: 'Failed to add expense' }, { status: 500 });
  }
}

// Helper function to get Google Sheets client
async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient });
}
