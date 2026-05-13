# Simple Google Sheets Setup

This is the easiest option for this site.

You do not need a Google Cloud service account.
You only need:

- a Google Sheet
- a small Google Apps Script
- one environment variable in Vercel

## 1. Prepare the Google Sheet

Open your Google Sheet and create this header row in the first sheet:

- `Дата и время`
- `Имя`
- `Фамилия`
- `Email`
- `Телефон`
- `Компания`
- `Формат`

The site will send values in that exact order.

## 2. Open Apps Script from the sheet

In Google Sheets:

`Extensions` -> `Apps Script`

## 3. Replace the default Apps Script code

Paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.createdAt || "",
      data.name || "",
      data.surname || "",
      data.email || "",
      data.phone || "",
      data.company || "",
      data.participationType || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 4. Publish as a Web App

In Apps Script:

`Deploy` -> `New deployment`

Select:

- Type: `Web app`
- Execute as: `Me`
- Who has access: `Anyone`

Click `Deploy`, approve access if Google asks, and copy the URL ending with `/exec`.

## 5. Add the URL in Vercel

Open your Vercel project:

`Settings` -> `Environment Variables`

Create this variable:

- `GOOGLE_SHEETS_WEB_APP_URL` = `https://script.google.com/macros/s/.../exec`

Then redeploy the project.

## 6. What happens next

After redeploy, each registration from the site form will be sent automatically to your Google Sheet as a new row.

## 7. Field mapping used by the site

The registration form sends:

- `name`
- `surname`
- `email`
- `phone`
- `company`
- `participationType`

The API also adds `createdAt` automatically.
