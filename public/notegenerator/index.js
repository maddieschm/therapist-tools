$(document).ready(function() {
    let allDiagnosesData = {}; // To store the loaded ICD and DSM diagnoses
    let currentDiagnosisClassification = ''; // To store the currently selected classification (ICD/DSM)

    // Initialize Select2 for diagnoses dropdown
    $('#diagnosisSelect').select2({
        placeholder: 'Select a diagnosis...',
        allowClear: true,
        multiple: true,
        disabled: true, // Initially disabled until a classification is chosen
        closeOnSelect: true // Added: Closes the dropdown after a selection
    });

    // Initialize Select2 for therapy styles dropdown
    $('#theorySelect').select2({
        placeholder: 'Search for therapy styles...',
        allowClear: true,
        multiple: true,
        closeOnSelect: true // Added: Closes the dropdown after a selection
    });

    // --- Load Diagnoses Data ---
    $.getJSON('diagnoses.json', function(data) {
        allDiagnosesData = data; // Store the full data
        console.log("Diagnoses data loaded successfully.");
    }).fail(function(jqxhr, textStatus, error) {
        console.error("Failed to load diagnoses.json: " + textStatus + ", " + error);
        alert("Error loading diagnoses data. Please try again later.");
    });

    // --- Handle Diagnosis Classification Selection (ICD/DSM Radio Buttons) ---
    $('input[name="diagnosisClassification"]').on('change', function() {
        currentDiagnosisClassification = $(this).val(); // Get the selected value (ICD or DSM)
        populateDiagnosesDropdown(currentDiagnosisClassification);
        
        // Enable the diagnosis select and hide the placeholder text
        $('#diagnosisSelect').prop('disabled', false);
        $('#diagnosisSelectPlaceholder').addClass('hidden');
    });

    // Function to populate the diagnoses dropdown based on classification
    function populateDiagnosesDropdown(classification) {
        $('#diagnosisSelect').empty().val(null).trigger('change'); // Clear current selections and options
        
        const diagnoses = allDiagnosesData[classification];
        if (diagnoses) {
            diagnoses.forEach(function(diagnosis) {
                $('#diagnosisSelect').append(new Option(diagnosis.name, diagnosis.code));
            });
        }
        $('#diagnosisSelect').trigger('change'); // Re-render Select2
    }

    // --- Load Therapy Styles Data ---
    $.getJSON('therapy_styles.json', function(data) {
        $('#theorySelect').empty();
        data.forEach(function(style) {
            $('#theorySelect').append(new Option(style.name, style.name));
        });
        $('#theorySelect').trigger('change');
        console.log("Therapy styles data loaded successfully.");
    }).fail(function(jqxhr, textStatus, error) {
        console.error("Failed to load therapy_styles.json: " + textStatus + ", " + error);
        alert("Error loading therapy styles data. Please try again later.");
    });

    // --- Form Submission Handler ---
    $('#noteForm').on('submit', function(event) {
        event.preventDefault();

        const selectedLocations = $('input[name="location"]:checked').map(function() { return $(this).val(); }).get();
        const locationText = selectedLocations.length > 0 ? selectedLocations.join(', ') : 'an unspecified location';

        const selectedDiagnoses = $('#diagnosisSelect').val();
        let diagnosisText = 'an unspecified diagnosis';
        if (selectedDiagnoses && selectedDiagnoses.length > 0) {
            // Get full names for diagnoses, not just codes
            const selectedDiagnosisNames = selectedDiagnoses.map(code => {
                const classificationDiagnoses = allDiagnosesData[currentDiagnosisClassification] || [];
                const diagnosisObj = classificationDiagnoses.find(d => d.code === code);
                return diagnosisObj ? diagnosisObj.name : code; // Fallback to code if name not found
            });
            diagnosisText = `${currentDiagnosisClassification} diagnosis of ${selectedDiagnosisNames.join(', ')}`;
        }
        
        const selectedTheories = $('#theorySelect').val();
        const theoryText = selectedTheories && selectedTheories.length > 0 ? selectedTheories.join(', ') : 'various therapeutic approaches';

        const sessionDate = $('#sessionDate').val();
        const sessionTime = $('#sessionTime').val();
        const sessionLength = $('#sessionLength').val().trim();
        const clinicianInitials = $('#clinicianInitials').val().trim();

        const summary = $('#summary').val().trim();

        let noteParts = [];
        noteParts.push(`The clinician met with the client ${locationText} to treat their ${diagnosisText}.`);
        noteParts.push(`The clinician utilized ${theoryText} to support the client in building their skills.`);
        noteParts.push(summary);

        // Add date, time, length, and initials at the end
        if (sessionDate || sessionTime || sessionLength || clinicianInitials) {
            let footerParts = [];
            if (sessionDate) footerParts.push(`on ${sessionDate}`);
            if (sessionTime) footerParts.push(`at ${sessionTime}`);
            if (sessionLength) footerParts.push(`for ${sessionLength}`);
            if (clinicianInitials) footerParts.push(`- ${clinicianInitials}`);
            noteParts.push(`The session took place ${footerParts.join(' ')}.`);
        }

        const generatedNote = noteParts.join(' ').replace(/\s{2,}/g, ' ');

        $('#generatedNote').text(generatedNote);
        $('#generatedNoteContainer').removeClass('hidden');

        $('html, body').animate({
            scrollTop: $('#generatedNoteContainer').offset().top
        }, 500);
    });

    // --- Export Note Button (.txt) ---
    $('#exportNoteButton').on('click', function() {
        const noteContent = $('#generatedNote').text();
        if (noteContent) {
            const blob = new Blob([noteContent], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'session_note.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert("Please generate a note first before exporting.");
        }
    });

    // --- Export JSON Button ---
    $('#exportJsonButton').on('click', function() {
        const formData = {
            location: [],
            diagnosisClassification: currentDiagnosisClassification,
            diagnosis: [],
            theory: [],
            sessionDate: $('#sessionDate').val(),
            sessionTime: $('#sessionTime').val(),
            sessionLength: $('#sessionLength').val(),
            clinicianInitials: $('#clinicianInitials').val(),
            summary: ''
        };

        $('input[name="location"]:checked').each(function() {
            formData.location.push($(this).val());
        });

        formData.diagnosis = $('#diagnosisSelect').val() || [];
        formData.theory = $('#theorySelect').val() || [];
        formData.summary = $('#summary').val();

        const jsonString = JSON.stringify(formData, null, 2);

        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'session_note_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // --- Import JSON Button ---
    $('#importJsonButton').on('click', function() {
        $('#importJsonFile').click();
    });

    $('#importJsonFile').on('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Reset form and Select2 fields
                    $('#noteForm').trigger('reset'); 
                    $('#diagnosisSelect').val(null).trigger('change');
                    $('#theorySelect').val(null).trigger('change');
                    $('#generatedNoteContainer').addClass('hidden');

                    // Prefill location checkboxes
                    if (data.location && Array.isArray(data.location)) {
                        data.location.forEach(val => {
                            $(`input[name="location"][value="${val}"]`).prop('checked', true);
                        });
                    }

                    // Prefill diagnosis classification and then diagnoses
                    if (data.diagnosisClassification) {
                        $(`input[name="diagnosisClassification"][value="${data.diagnosisClassification}"]`).prop('checked', true).trigger('change');
                        // Use a short delay to ensure Select2 has time to re-populate options
                        setTimeout(() => {
                            if (data.diagnosis && Array.isArray(data.diagnosis)) {
                                const classificationDiagnoses = allDiagnosesData[data.diagnosisClassification] || [];
                                const validDiagnoses = data.diagnosis.filter(code => 
                                    classificationDiagnoses.some(d => d.code === code)
                                );
                                $('#diagnosisSelect').val(validDiagnoses).trigger('change');
                            }
                        }, 100); 
                    } else {
                        // If no classification saved, ensure diagnosis select is disabled and placeholder visible
                        $('#diagnosisSelect').prop('disabled', true);
                        $('#diagnosisSelectPlaceholder').removeClass('hidden');
                    }
                    
                    // Prefill therapy dropdown
                    if (data.theory && Array.isArray(data.theory)) {
                        const currentTheoryOptions = $('#theorySelect option').map(function() { return $(this).val(); }).get();
                        const theoriesToSelect = data.theory.filter(t => currentTheoryOptions.includes(t));
                        $('#theorySelect').val(theoriesToSelect).trigger('change');
                    }

                    // Prefill new fields
                    if (data.sessionDate) $('#sessionDate').val(data.sessionDate);
                    if (data.sessionTime) $('#sessionTime').val(data.sessionTime);
                    if (data.sessionLength) $('#sessionLength').val(data.sessionLength);
                    if (data.clinicianInitials) $('#clinicianInitials').val(data.clinicianInitials);

                    // Prefill summary textarea
                    if (data.summary) {
                        $('#summary').val(data.summary);
                    }

                } catch (error) {
                    console.error("Error parsing JSON file: ", error);
                    alert("Invalid JSON file. Please ensure it's a valid JSON format.");
                }
            };
            reader.readAsText(file);
        }
    });

    // --- Copy Note to Clipboard Button ---
    $('#copyNoteButton').on('click', function() {
        const noteText = $('#generatedNote').text();
        if (noteText) {
            // Using execCommand for broader compatibility within iframe environments
            const tempTextArea = document.createElement('textarea');
            tempTextArea.value = noteText;
            document.body.appendChild(tempTextArea);
            tempTextArea.select();
            document.execCommand('copy');
            document.body.removeChild(tempTextArea);
            alert('Note copied to clipboard!'); 
        } else {
            alert('No note to copy.');
        }
    });

    // --- Clear Form Button ---
    $('#noteForm').on('reset', function() {
        // Reset Select2 fields explicitly
        $('#diagnosisSelect').val(null).trigger('change');
        $('#theorySelect').val(null).trigger('change');
        // Re-disable diagnosis select and show placeholder
        $('#diagnosisSelect').prop('disabled', true);
        $('#diagnosisSelectPlaceholder').removeClass('hidden');
        // Clear new fields
        $('#sessionDate').val('');
        $('#sessionTime').val('');
        $('#sessionLength').val('');
        $('#clinicianInitials').val('');
        // Hide generated note container
        $('#generatedNoteContainer').addClass('hidden');
        currentDiagnosisClassification = ''; // Clear stored classification
    });
});
