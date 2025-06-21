# PayCalc

PayCalc is a web-based pay calculator built with Next.js, React, and TypeScript. It helps employees estimate their weekly pay by accounting for overtime, holiday rates and deductions. The app includes a simple form for entering times and provides an option to print or export a pay stub as PDF.

![App Screenshot](screenshot.png)

## Features

- Calculate regular, overtime and holiday pay
- Apply deductions such as pension, union dues, CPP and EI
- Supports night shift and weekend premiums
- "Print" and "Download PDF" buttons to export a pay stub
- Offline capable Progressive Web App

## Prerequisites

- **Node.js** 18 or newer
- **npm** or compatible package manager
- A modern browser (Chrome, Firefox, Edge, Safari)
- Optional: Values for pay rates and deductions can be configured via environment variables:
  - `REGULAR_RATE`
  - `PENSION_BIWEEKLY`
  - `UNION_DUES_WEEKLY`

## Installation

```bash
# Clone the repo
git clone <repository-url>
cd pay-calculator

# Install dependencies
npm install
```

## Usage

### Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Navigate to **/pay** to access the calculator form.

### Exporting a Pay Stub

1. Fill out the weekly schedule and click **Calculate**.
2. Use **Print Results** to print directly from the browser.
3. Click **Download PDF** to save the pay stub.

## Troubleshooting

- **"next: not found"** – make sure `npm install` ran successfully and `node_modules` exists.
- **Unexpected pay amounts** – verify environment variables for rates and deductions are set correctly.

## Contributing

Contributions are welcome! Fork the repository and open a pull request with your changes.

## License

This project is licensed under the MIT License.
