# Therapist Tools

This is a [Next.js](https://nextjs.org/) project and a collection of web-based tools designed to assist mental health clinicians in streamlining their workflow. The primary tools currently available are the "Counseling Session Notes Generator," "Client Therapy Letter Generator," and "Insurance Reimbursement Superbill Generator," aimed at simplifying documentation, especially for neurodivergent therapists.

## Available Tools

### Counseling Session Notes Generator

The "Counseling Session Notes Generator" is a static web application that helps clinicians quickly draft psychotherapy session notes. It features interactive, searchable dropdowns for diagnoses (ICD and DSM classifications) and therapy types, along with fields for essential session details. This tool reduces cognitive load during documentation, allowing for the generation of structured, accurate, and professional notes efficiently.

**Key Features:**
* **Dynamic Session Details**: Input session location (in-person or telehealth), date, time, length, and clinician's initials.
* **Intelligent Diagnosis Selection**: Choose between ICD and DSM classifications to dynamically populate a searchable dropdown for diagnoses, supporting multiple selections.
* **Comprehensive Therapy Modality Selection**: Searchable dropdown for various therapy styles, allowing multiple selections.
* **Automated Note Generation**: Automatically constructs a coherent therapy note from all inputs.
* **Copy to Clipboard**: Instantly copy the generated note.
* **Export Note (.txt)**: Download the note as a plain text file.
* **Data Export/Import (.json)**: Save and load all form inputs as a JSON file for reuse or template loading.
* **Responsive and Accessible Design**: Built with Tailwind CSS and Select2 for responsiveness and enhanced accessibility.

For detailed instructions on how to use the Counseling Session Notes Generator, please refer to its dedicated README: [Counseling Session Notes Generator README](public/notegenerator/README.md).

### Client Therapy Letter Generator

The "Client Therapy Letter Generator" is a tool to quickly generate standardized client letters, such as Emotional Support Animal (ESA) and academic accommodation letters.

**Key Features:**
* **Letter Type Selection**: Choose from predefined letter types.
* **Dynamic Fields**: Fill in client and clinician details, and the letter template will be populated accordingly.
* **Accommodation Suggestions**: For academic accommodation letters, you can select from a list of suggested accommodations based on the client's diagnosis.
* **Customizable**: Add a custom license type if not available in the dropdown and upload a signature image.
* **Export and Import**: Save and load letter data as a JSON file.

### Insurance Superbill Generator

The "Insurance Superbill Generator" helps create and manage superbills for insurance reimbursement.

**Key Features:**
* **Collapsible Sections**: The form is organized into collapsible sections for practice, provider, and client information.
* **Dynamic Service Entries**: Add multiple service entries with details like date of service, CPT code, and fees.
* **Automated Calculations**: The tool automatically calculates total charges, amount paid, and balance due.
* **Print and Export**: Print the generated superbill or export the data as a JSON file.
* **Import Data**: Load client data from a previously saved JSON file.

## Technologies Used

* [Next.js](https://nextjs.org/)
* [React](https://react.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [ESLint](https://eslint.org/)
* **For the Note Generator**:
    * [jQuery](https://jquery.com/)
    * [Select2](https://select2.org/)

## Getting Started

To set up and run this project on your local machine for development or testing:

1.  **Clone the Repository**:
    ```bash
    git clone [https://github.com/maddieschm/therapist-tools.git](https://github.com/maddieschm/therapist-tools.git)
    ```

2.  **Navigate to the Project Directory**:
    ```bash
    cd therapist-tools
    ```

3.  **Install Dependencies**:
    The project uses npm as its package manager.
    ```bash
    npm install
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

5.  **Accessing the Static Tools**:
    The "Counseling Session Notes Generator," "Client Therapy Letter Generator," and "Insurance Superbill Generator" are static applications. You can access them directly after starting the development server at the following paths:
    * `/notegenerator/index.html`
    * `/lettergenerator/index.html`
    * `/superbillgenerator/index.html`

## Project Structure
```
.
├── .github/workflows/nextjs.yml  # GitHub Actions workflow for deployment
├── .gitignore                    # Specifies intentionally untracked files
├── README.md                     # Main project README
├── next.config.ts                # Next.js configuration
├── package.json                  # Project dependencies and scripts
├── public/                       # Static assets
│   ├── lettergenerator/          # Contains files for the Client Therapy Letter Generator
│   ├── notegenerator/            # Contains files for the Counseling Session Notes Generator
│   └── superbillgenerator/       # Contains files for the Insurance Superbill Generator
├── src/                          # Source code for the Next.js application
│   └── pages/
│       ├── _app.tsx              # Custom App component
│       ├── _document.tsx         # Custom Document component
│       └── index.tsx             # Main page for the Next.js application
└── tsconfig.json                 # TypeScript configuration
```
## Contributing

Contributions are welcome! If you have suggestions for new features, bug fixes, or improvements to the existing codebase, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to existing coding styles and includes relevant updates to the documentation.

## License

This project is licensed under the MIT License.

## Contact

For any questions, suggestions, or feedback, please open an issue on this repository.