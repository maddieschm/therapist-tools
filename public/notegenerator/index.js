$(document).ready(function() {
    let allDiagnosesData = {};
    let currentDiagnosisClassification = '';

    // Initialize Select2 dropdowns
    $('#diagnosisSelect').select2({
        placeholder: 'Select a diagnosis...',
        allowClear: true,
        multiple: true,
        disabled: true,
        closeOnSelect: true
    });
    $('#theorySelect').select2({
        placeholder: 'Search for therapy styles...',
        allowClear: true,
        multiple: true,
        closeOnSelect: true
    });

    // --- Data Loading ---
    $.getJSON('diagnoses.json', function(data) {
        allDiagnosesData = data;
    });
    $.getJSON('therapy_styles.json', function(data) {
        $('#theorySelect').empty();
        data.forEach(function(style) {
            $('#theorySelect').append(new Option(style.name, style.name));
        });
        $('#theorySelect').trigger('change');
    });

    // --- Event Handlers ---
    $('input[name="diagnosisClassification"]').on('change', function() {
        currentDiagnosisClassification = $(this).val();
        populateDiagnosesDropdown(currentDiagnosisClassification);
        $('#diagnosisSelect').prop('disabled', false);
        $('#diagnosisSelectPlaceholder').addClass('hidden');
    });

    $('#noteTemplateSelect').on('change', function() {
        const selectedTemplate = $(this).val();
        $('.note-template-section').addClass('hidden');
        $(`#${selectedTemplate}-note-fields`).removeClass('hidden');
    });
    // Set the initial view on page load
    $('#noteTemplateSelect').trigger('change');

    function populateDiagnosesDropdown(classification) {
        $('#diagnosisSelect').empty().val(null).trigger('change');
        const diagnoses = allDiagnosesData[classification];
        if (diagnoses) {
            diagnoses.forEach(function(diagnosis) {
                $('#diagnosisSelect').append(new Option(diagnosis.name, diagnosis.code));
            });
        }
        $('#diagnosisSelect').trigger('change');
    }

    // --- Form Submission Handler ---
    $('#noteForm').on('submit', function(event) {
        event.preventDefault();
        const template = $('#noteTemplateSelect').val();
        let noteContent = "";

        const selectedLocations = $('input[name="location"]:checked').map(function() { return $(this).val(); }).get();
        const locationText = selectedLocations.length > 0 ? selectedLocations.join(', ') : 'an unspecified location';
        const selectedDiagnoses = $('#diagnosisSelect').val();
        let diagnosisText = 'an unspecified diagnosis';
        if (selectedDiagnoses && selectedDiagnoses.length > 0) {
            const selectedDiagnosisNames = selectedDiagnoses.map(code => {
                const diagnosisObj = (allDiagnosesData[currentDiagnosisClassification] || []).find(d => d.code === code);
                return diagnosisObj ? diagnosisObj.name : code;
            });
            diagnosisText = `${currentDiagnosisClassification} diagnosis of ${selectedDiagnosisNames.join(', ')}`;
        }
        const selectedTheories = $('#theorySelect').val();
        const theoryText = selectedTheories && selectedTheories.length > 0 ? selectedTheories.join(', ') : 'various therapeutic approaches';

        const intro = `The clinician met with the client ${locationText} to treat their ${diagnosisText}. The clinician utilized ${theoryText} to support the client in building their skills.`;

        switch(template) {
            case 'dap':
                noteContent = `${intro}\n\nD: ${$('#dap-data').val()}\n\nA: ${$('#dap-assessment').val()}\n\nP: ${$('#dap-plan').val()}`;
                break;
            case 'soap':
                noteContent = `${intro}\n\nS: ${$('#soap-subjective').val()}\nO: ${$('#soap-objective').val()}\nA: ${$('#soap-assessment').val()}\nP: ${$('#soap-plan').val()}`;
                break;
            case 'birp':
                noteContent = `${intro}\n\nB: ${$('#birp-behavior').val()}\nI: ${$('#birp-intervention').val()}\nR: ${$('#birp-response').val()}\nP: ${$('#birp-plan').val()}`;
                break;
            case 'girp':
                noteContent = `${intro}\n\nG: ${$('#girp-goals').val()}\nI: ${$('#girp-intervention').val()}\nR: ${$('#girp-response').val()}\nP: ${$('#girp-plan').val()}`;
                break;
            case 'pirp':
                noteContent = `${intro}\n\nP: ${$('#pirp-problem').val()}\nI: ${$('#pirp-intervention').val()}\nR: ${$('#pirp-response').val()}\nP: ${$('#pirp-plan').val()}`;
                break;
            case 'narrative':
                noteContent = `${intro}\n\n${$('#narrative-summary').val()}`;
                break;
            case 'mse':
                noteContent = `Appearance: ${$('#mse-appearance').val()}\nBehavior/Psychomotor Activity: ${$('#mse-behavior').val()}\nAttitude toward Examiner: ${$('#mse-attitude').val()}\nAffect and Mood: ${$('#mse-affect').val()}\nSpeech and Thought: ${$('#mse-speech').val()}\nPerceptual Disturbances: ${$('#mse-perceptual').val()}\nOrientation and Consciousness: ${$('#mse-orientation').val()}\nMemory and Intelligence: ${$('#mse-memory').val()}\nReliability, Judgment, and Insight: ${$('#mse-reliability').val()}`;
                break;
            default: // Generic
                noteContent = `${intro} ${$('#summary').val().trim()}`;
                break;
        }
        
        const sessionDate = $('#sessionDate').val();
        const sessionTime = $('#sessionTime').val();
        const sessionLength = $('#sessionLength').val().trim();
        const clinicianInitials = $('#clinicianInitials').val().trim();
        let footer = "";
        if (sessionDate || sessionTime || sessionLength || clinicianInitials) {
            let footerParts = [];
            if (sessionDate) footerParts.push(`on ${sessionDate}`);
            if (sessionTime) footerParts.push(`at ${sessionTime}`);
            if (sessionLength) footerParts.push(`for ${sessionLength}`);
            if (clinicianInitials) footerParts.push(`- ${clinicianInitials}`);
            footer = `\n\nThe session took place ${footerParts.join(' ')}.`;
        }

        const finalNote = noteContent + footer;
        $('#generatedNote').text(finalNote.trim());
        $('#generatedNoteContainer').removeClass('hidden');
        $('html, body').animate({ scrollTop: $('#generatedNoteContainer').offset().top }, 500);
    });

    // --- Your existing Export, Import, Copy, and Clear functions ---
    
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

    $('#exportJsonButton').on('click', function() {
        const formData = {
            noteTemplate: $('#noteTemplateSelect').val(),
            location: $('input[name="location"]:checked').map(function() { return $(this).val(); }).get(),
            diagnosisClassification: currentDiagnosisClassification,
            diagnosis: $('#diagnosisSelect').val() || [],
            theory: $('#theorySelect').val() || [],
            sessionDate: $('#sessionDate').val(),
            sessionTime: $('#sessionTime').val(),
            sessionLength: $('#sessionLength').val(),
            clinicianInitials: $('#clinicianInitials').val(),
            summary: $('#summary').val(),
            dapData: $('#dap-data').val(),
            dapAssessment: $('#dap-assessment').val(),
            dapPlan: $('#dap-plan').val(),
            soapSubjective: $('#soap-subjective').val(),
            soapObjective: $('#soap-objective').val(),
            soapAssessment: $('#soap-assessment').val(),
            soapPlan: $('#soap-plan').val(),
            birpBehavior: $('#birp-behavior').val(),
            birpIntervention: $('#birp-intervention').val(),
            birpResponse: $('#birp-response').val(),
            birpPlan: $('#birp-plan').val(),
            girpGoals: $('#girp-goals').val(),
            girpIntervention: $('#girp-intervention').val(),
            girpResponse: $('#girp-response').val(),
            girpPlan: $('#girp-plan').val(),
            pirpProblem: $('#pirp-problem').val(),
            pirpIntervention: $('#pirp-intervention').val(),
            pirpResponse: $('#pirp-response').val(),
            pirpPlan: $('#pirp-plan').val(),
            narrativeSummary: $('#narrative-summary').val(),
            mseAppearance: $('#mse-appearance').val(),
            mseBehavior: $('#mse-behavior').val(),
            mseAttitude: $('#mse-attitude').val(),
            mseAffect: $('#mse-affect').val(),
            mseSpeech: $('#mse-speech').val(),
            msePerceptual: $('#mse-perceptual').val(),
            mseOrientation: $('#mse-orientation').val(),
            mseMemory: $('#mse-memory').val(),
            mseReliability: $('#mse-reliability').val()
        };
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

    $('#importJsonButton').on('click', function() {
        $('#importJsonFile').click();
    });

    $('#importJsonFile').on('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                $('#noteForm').trigger('reset');
                
                $('#noteTemplateSelect').val(data.noteTemplate || 'generic').trigger('change');
                if (data.location) data.location.forEach(val => $(`input[name="location"][value="${val}"]`).prop('checked', true));
                
                if (data.diagnosisClassification) {
                    $(`input[name="diagnosisClassification"][value="${data.diagnosisClassification}"]`).prop('checked', true).trigger('change');
                    setTimeout(() => {
                        if (data.diagnosis) $('#diagnosisSelect').val(data.diagnosis).trigger('change');
                    }, 100); 
                }
                
                if (data.theory) $('#theorySelect').val(data.theory).trigger('change');

                $('#sessionDate').val(data.sessionDate || '');
                $('#sessionTime').val(data.sessionTime || '');
                $('#sessionLength').val(data.sessionLength || '');
                $('#clinicianInitials').val(data.clinicianInitials || '');
                $('#summary').val(data.summary || '');
                $('#dap-data').val(data.dapData || '');
                $('#dap-assessment').val(data.dapAssessment || '');
                $('#dap-plan').val(data.dapPlan || '');
                $('#soap-subjective').val(data.soapSubjective || '');
                $('#soap-objective').val(data.soapObjective || '');
                $('#soap-assessment').val(data.soapAssessment || '');
                $('#soap-plan').val(data.soapPlan || '');
                $('#birp-behavior').val(data.birpBehavior || '');
                $('#birp-intervention').val(data.birpIntervention || '');
                $('#birp-response').val(data.birpResponse || '');
                $('#birp-plan').val(data.birpPlan || '');
                $('#girp-goals').val(data.girpGoals || '');
                $('#girp-intervention').val(data.girpIntervention || '');
                $('#girp-response').val(data.girpResponse || '');
                $('#girp-plan').val(data.girpPlan || '');
                $('#pirp-problem').val(data.pirpProblem || '');
                $('#pirp-intervention').val(data.pirpIntervention || '');
                $('#pirp-response').val(data.pirpResponse || '');
                $('#pirp-plan').val(data.pirpPlan || '');
                $('#narrative-summary').val(data.narrativeSummary || '');
                $('#mse-appearance').val(data.mseAppearance || '');
                $('#mse-behavior').val(data.mseBehavior || '');
                $('#mse-attitude').val(data.mseAttitude || '');
                $('#mse-affect').val(data.mseAffect || '');
                $('#mse-speech').val(data.mseSpeech || '');
                $('#mse-perceptual').val(data.msePerceptual || '');
                $('#mse-orientation').val(data.mseOrientation || '');
                $('#mse-memory').val(data.mseMemory || '');
                $('#mse-reliability').val(data.mseReliability || '');

            } catch (error) {
                console.error("Error parsing JSON file:", error);
                alert("Invalid JSON file.");
            }
        };
        reader.readAsText(file);
        $(this).val('');
    });

    $('#copyNoteButton').on('click', function() {
        const noteText = $('#generatedNote').text();
        if (noteText) {
            navigator.clipboard.writeText(noteText).then(() => alert('Note copied to clipboard!'));
        }
    });

    $('#noteForm').on('reset', function() {
        $('#diagnosisSelect, #theorySelect').val(null).trigger('change');
        $('#diagnosisSelect').prop('disabled', true);
        $('#diagnosisSelectPlaceholder').removeClass('hidden');
        $('#generatedNoteContainer').addClass('hidden');
        currentDiagnosisClassification = '';
        $('#noteTemplateSelect').val('generic').trigger('change');
    });
});