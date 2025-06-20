# Therapist Tools

This is a [Next.js](https://nextjs.org) project and a collection of web-based tools designed to assist mental health clinicians in streamlining their workflow. The primary tool currently available is the "Counseling Session Notes Generator", aimed at simplifying note-taking, especially for neurodivergent therapists.

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

For detailed instructions on how to use the Counseling Session Notes Generator, please refer to its dedicated README: [Counseling Session Notes Generator README](https://github.com/maddieschm/therapist-tools/blob/3f7391db35f4c52f1bc3a9312917d4dbf4e403f7/public/notegenerator/README.md).

## Technologies Used

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **ESLint**
* **For the Note Generator**:
    * jQuery
    * Select2

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

5.  **Accessing the Counseling Session Notes Generator**:
    Since the "Counseling Session Notes Generator" is a static application, you can access it directly after building the Next.js project or run it independently.
    To run the static generator locally for development:
    ```bash
    cd public/notegenerator
    python -m http.server # Or use `npx http-server .` if Node.js is preferred
    ```
    Then, open your web browser and navigate to `http://localhost:8000` (or the port indicated by your server).

## Project Structure
This looks great! Can you write that in markdown so I can copy and paste it?

Markdown

# Therapist Tools

This is a [Next.js](https://nextjs.org) project and a collection of web-based tools designed to assist mental health clinicians in streamlining their workflow. The primary tool currently available is the "Counseling Session Notes Generator", aimed at simplifying note-taking, especially for neurodivergent therapists.

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

For detailed instructions on how to use the Counseling Session Notes Generator, please refer to its dedicated README: [Counseling Session Notes Generator README](https://github.com/maddieschm/therapist-tools/blob/3f7391db35f4c52f1bc3a9312917d4dbf4e403f7/public/notegenerator/README.md).

## Technologies Used

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **ESLint**
* **For the Note Generator**:
    * jQuery
    * Select2

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

5.  **Accessing the Counseling Session Notes Generator**:
    Since the "Counseling Session Notes Generator" is a static application, you can access it directly after building the Next.js project or run it independently.
    To run the static generator locally for development:
    ```bash
    cd public/notegenerator
    python -m http.server # Or use `npx http-server .` if Node.js is preferred
    ```
    Then, open your web browser and navigate to `http://localhost:8000` (or the port indicated by your server).

## Project Structure
```
.
├── .github/workflows/nextjs.yml  # GitHub Actions workflow for deployment
├── .gitignore                    # Specifies intentionally untracked files
├── README.md                     # Main project README
├── eslint.config.mjs             # ESLint configuration
├── next-env.d.ts                 # TypeScript declaration for Next.js environment
├── next.config.ts                # Next.js configuration
├── package-lock.json             # npm lock file
├── package.json                  # Project dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration, includes Tailwind CSS
├── public/                       # Static assets
│   └── notegenerator/            # Contains files for the Counseling Session Notes Generator
│       ├── README.md             # Specific README for the Note Generator
│       ├── diagnoses.json        # JSON data for ICD and DSM diagnoses
│       ├── index.html            # Main HTML file for the Note Generator UI
│       ├── index.js              # JavaScript logic for the Note Generator
│       ├── main.css              # Custom CSS for styling and Select2 overrides
│       └── therapy_styles.json   # JSON data for various therapy modalities
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

This project is licensed under the [MIT License](https://github.com/maddieschm/therapist-tools/blob/main/LICENSE).

## Contact

For any questions, suggestions, or feedback, please open an issue on this repository.

## Acknowledgments and Credits

* [Next.js](https://nextjs.org/)
* [React](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [jQuery](https://jquery.com/)
* [Select2](https://select2.org/)
* [Google Fonts](https://fonts.google.com/)
* ICD and DSM diagnosis data
* Therapy style data
