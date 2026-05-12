# Google Sheets Setup

## 1. Create the spreadsheet

Create a Google Sheet and add this header row in sheet `Registrations`:

`createdAt | name | surname | email | phone | company | participationType`

You can rename the sheet, but then update `GOOGLE_SHEETS_SHEET_NAME`.

## 2. Get the spreadsheet ID

Open your sheet URL:

`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

Copy the `SPREADSHEET_ID` part.

## 3. Create a Google Cloud service account

1. Open Google Cloud Console.
2. Create or select a project.
3. Enable Google Sheets API.
4. Create a Service Account.
5. Create a JSON key for that service account.

You will need:

- `client_email`
- `private_key`

## 4. Share the sheet with the service account

Open the Google Sheet and share it with the service account email like:

`your-service-account@your-project.iam.gserviceaccount.com`

Give it `Editor` access.

## 5. Add environment variables in Vercel

In your Vercel project, add:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_SHEETS_SHEET_NAME`

For `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, paste the full key including
`-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`.

## 6. Redeploy

After saving environment variables in Vercel, trigger a new deployment.

Then every successful registration will be appended to Google Sheets automatically.
