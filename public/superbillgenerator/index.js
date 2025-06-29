$(document).ready(function() {
    let superbillServiceCounter = 0;
    let _allSuperbillClients = [];
    let _currentClientSuperbillId = null;

    // A simple, self-contained function to generate unique IDs.
    function simpleUniqueId() {
        return 'id-' + Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    // --- Superbill Generator Logic ---
    function renumberServiceEntries() {
        $('.superbill-service-entry').each(function(index, element) {
            const sessionNumber = index + 1;
            $(element).find('h4').text(`Session ${sessionNumber}`);
            $(element).find('label, input, select').each(function() {
                if (this.id) this.id = this.id.replace(/\d+$/, sessionNumber);
                if ($(this).is('label') && this.htmlFor) this.htmlFor = this.htmlFor.replace(/\d+$/, sessionNumber);
            });
        });
        superbillServiceCounter = $('.superbill-service-entry').length;
    }

    function addSuperbillServiceEntry(data = {}) {
        superbillServiceCounter++;
        const newServiceEntryHtml = `
            <div class="superbill-service-entry mb-4 p-4 border border-dashed border-gray-500 rounded-md bg-gray-700 relative">
                <div class="flex justify-between items-center mb-2">
                    <h4 class="text-lg font-semibold text-sky-200">Session ${superbillServiceCounter}</h4>
                    <button type="button" class="remove-service-btn px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">REMOVE</button>
                </div>
                <label for="superbillServiceDate${superbillServiceCounter}" class="block text-base font-medium text-sky-100 mb-1">Date of Service:</label>
                <input type="date" class="superbill-service-date w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-sky-100" id="superbillServiceDate${superbillServiceCounter}" value="${data.date || ''}" required>
                <label for="superbillPlaceOfService${superbillServiceCounter}" class="block text-base font-medium text-sky-100 mb-1 mt-2">Place of Service:</label>
                <select class="superbill-place-of-service w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-sky-100" id="superbillPlaceOfService${superbillServiceCounter}" required>
                    <option value="11" ${data.placeOfService === '11' ? 'selected' : ''}>11 - Office</option>
                    <option value="02" ${data.placeOfService === '02' ? 'selected' : ''}>02 - Telehealth (Not in Patient's Home)</option>
                    <option value="10" ${data.placeOfService === '10' ? 'selected' : ''}>10 - Telehealth (In Patient's Home)</option>
                </select>
                <label for="superbillCptCode${superbillServiceCounter}" class="block text-base font-medium text-sky-100 mb-1 mt-2">CPT Code:</label>
                <select class="superbill-cpt-code w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-sky-100" id="superbillCptCode${superbillServiceCounter}" required>
                    <option value="90791" ${data.cptCode === '90791' ? 'selected' : ''}>90791 - Psychiatric Diagnostic Evaluation</option>
                    <option value="90832" ${data.cptCode === '90832' ? 'selected' : ''}>90832 - Psychotherapy, 30 minutes</option>
                    <option value="90834" ${data.cptCode === '90834' || !data.cptCode ? 'selected' : ''}>90834 - Psychotherapy, 45 minutes</option>
                    <option value="90837" ${data.cptCode === '90837' ? 'selected' : ''}>90837 - Psychotherapy, 60 minutes</option>
                    <option value="90846" ${data.cptCode === '90846' ? 'selected' : ''}>90846 - Family Psychotherapy (without patient)</option>
                    <option value="90847" ${data.cptCode === '90847' ? 'selected' : ''}>90847 - Family Psychotherapy (with patient)</option>
                    <option value="90853" ${data.cptCode === '90853' ? 'selected' : ''}>90853 - Group Psychotherapy</option>
                </select>
                <label for="superbillFeePerSession${superbillServiceCounter}" class="block text-base font-medium text-sky-100 mb-1 mt-2">Fee Per Session:</label>
                <input type="number" step="0.01" class="superbill-fee-per-session w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-sky-100" id="superbillFeePerSession${superbillServiceCounter}" value="${(data.feePerSession || 0).toFixed(2)}" required>
                <label for="superbillAmountPaid${superbillServiceCounter}" class="block text-base font-medium text-sky-100 mb-1 mt-2">Amount Paid:</label>
                <input type="number" step="0.01" class="superbill-amount-paid w-full p-2 border border-gray-600 rounded-md bg-gray-800 text-sky-100" id="superbillAmountPaid${superbillServiceCounter}" value="${(data.amountPaid || 0).toFixed(2)}" required>
            </div>
        `;
        $('#superbillServiceEntries').append(newServiceEntryHtml);
        renumberServiceEntries();
    }

    if ($('.superbill-service-entry').length === 0) addSuperbillServiceEntry();
    $('#addSuperbillService').on('click', () => addSuperbillServiceEntry());
    $('#superbillServiceEntries').on('click', '.remove-service-btn', function() {
        $(this).closest('.superbill-service-entry').remove();
        renumberServiceEntries();
    });

    function formatDate(dateInput) {
        if (!dateInput) return '';
        const date = new Date(dateInput);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
        return adjustedDate.toISOString().split('T')[0];
    }

    function collectSuperbillFormData() {
        const formData = {
            clientId: $('#superbillClientId').val() || simpleUniqueId(),
            practice: {
                name: $('#superbillPracticeName').val(),
                address: $('#superbillPracticeAddress').val(),
                cityStateZip: $('#superbillPracticeCityStateZip').val(),
                phone: $('#superbillPracticePhone').val(),
                email: $('#superbillPracticeEmail').val(),
                website: $('#superbillPracticeWebsite').val(),
            },
            provider: {
                name: $('#superbillProviderName').val(),
                credential: $('input[name="providerCredential"]:checked').val(),
                license: $('#superbillProviderLicense').val(),
                npi: $('#superbillNpi').val(),
            },
            client: {
                name: $('#superbillClientName').val(),
                dob: $('#superbillClientDOB').val(),
                address: $('#superbillClientAddress').val(),
                cityStateZip: $('#superbillClientCityStateZip').val(),
                phone: $('#superbillClientPhone').val(),
                insuranceId: $('#superbillClientInsuranceId').val(),
            },
            diagnosis: {
                primaryDescription: $('#superbillPrimaryDiagnosisDescription').val(),
                primaryCode: $('#superbillPrimaryDiagnosisCode').val(),
                secondaryDescription: $('#superbillSecondaryDiagnosisDescription').val(),
                secondaryCode: $('#superbillSecondaryDiagnosisCode').val(),
            },
            services: [],
        };
        $('.superbill-service-entry').each(function() {
            const service = {
                date: $(this).find('.superbill-service-date').val(),
                placeOfService: $(this).find('.superbill-place-of-service').val(),
                cptCode: $(this).find('.superbill-cpt-code').val(),
                feePerSession: parseFloat($(this).find('.superbill-fee-per-session').val() || 0),
                amountPaid: parseFloat($(this).find('.superbill-amount-paid').val() || 0),
            };
            formData.services.push(service);
        });
        return formData;
    }

    $('#superbillForm').on('submit', function(event) {
        event.preventDefault();
        const requiredFields = [
            { id: '#superbillPracticeName', name: 'Practice Name' }, { id: '#superbillPracticeAddress', name: 'Practice Address' },
            { id: '#superbillPracticeCityStateZip', name: 'Practice City, State, Zip' }, { id: '#superbillPracticePhone', name: 'Practice Phone' },
            { id: '#superbillPracticeEmail', name: 'Practice Email' }, { id: '#superbillProviderName', name: 'Provider Name' },
            { id: '#superbillProviderLicense', name: 'Provider License' }, { id: '#superbillNpi', name: 'NPI' },
            { id: '#superbillClientName', name: 'Client Name' }, { id: '#superbillClientDOB', name: 'Client Date of Birth' },
            { id: '#superbillClientAddress', name: 'Client Address' }, { id: '#superbillClientCityStateZip', name: 'Client City, State, Zip' },
            { id: '#superbillClientPhone', name: 'Client Phone' }, { id: '#superbillClientInsuranceId', name: 'Client Insurance ID' },
            { id: '#superbillPrimaryDiagnosisDescription', name: 'Primary Diagnosis Description' }, { id: '#superbillPrimaryDiagnosisCode', name: 'Primary Diagnosis Code' }
        ];

        for (const field of requiredFields) {
            if (!$(field.id).val()) {
                alert(`Validation failed: Please fill out the "${field.name}" field.`);
                $(field.id).focus();
                return;
            }
        }
        
        let servicesValid = true;
        if ($('.superbill-service-entry').length === 0) {
            alert('Validation failed: At least one service must be added.');
            return;
        }
        $('.superbill-service-entry').each(function(index) {
            if (!$(this).find('.superbill-service-date').val()) {
                alert(`Validation failed: Please provide a "Date of Service" for Session ${index + 1}.`);
                $(this).find('.superbill-service-date').focus();
                servicesValid = false;
                return false;
            }
        });

        if (!servicesValid) return;

        saveCurrentSuperbillClient();
        const formData = collectSuperbillFormData();
        const { practice, provider, client, diagnosis, services } = formData;
        
        const providerFullName = `${provider.name}, ${provider.credential}`;
        let totalCharges = 0;
        let totalAmountPaid = 0;
        
        const servicesHtml = services.map((service, index) => {
            const cptSelectElement = $(`#superbillCptCode${index + 1}`);
            const description = cptSelectElement.length ? cptSelectElement.find('option:selected').text().split(' - ')[1] || 'N/A' : 'N/A';
            const fee = service.feePerSession;
            const paid = service.amountPaid;
            totalCharges += fee;
            totalAmountPaid += paid;
            return `<tr><td>${formatDate(service.date)}</td><td>${service.placeOfService}</td><td>${service.cptCode}</td><td>${description}</td><td>$${fee.toFixed(2)}</td><td>$${paid.toFixed(2)}</td></tr>`;
        }).join('');
        const balanceDue = totalCharges - totalAmountPaid;

        const superbillContent = `
            <div class="superbill-header" style="text-align:center;">
                <p style="font-weight: bold; font-size: 1.5em; margin-bottom: 5px;">${practice.name}</p>
                <p style="margin-bottom: 5px;">${practice.address}<br>${practice.cityStateZip}</p>
                <p style="margin-bottom: 5px;">Phone: ${practice.phone} | Email: ${practice.email}</p>
                ${practice.website ? `<p>Website: <a href="${practice.website}" target="_blank">${practice.website}</a></p>` : ''}
            </div>
            <hr style="border: 0; border-top: 1px solid #ccc; margin: 20px 0;">
            <p style="text-align: center; font-weight: bold; font-size: 1.2em;">SUPERBILL / ITEMIZED STATEMENT</p>
            <p style="text-align: center; font-size: 0.9em;"><strong>Date Issued:</strong> ${formatDate(new Date())}</p>
            <h3 class="section-title">CLIENT INFORMATION</h3>
            <p><strong>Name:</strong> ${client.name}<br><strong>DOB:</strong> ${formatDate(client.dob)}<br><strong>Address:</strong> ${client.address}, ${client.cityStateZip}<br><strong>Phone:</strong> ${client.phone}<br><strong>Insurance ID:</strong> ${client.insuranceId}</p>
            <h3 class="section-title">PROVIDER INFORMATION</h3>
            <p><strong>Name:</strong> ${providerFullName}<br><strong>License Number:</strong> ${provider.license}<br><strong>NPI:</strong> ${provider.npi}</p>
            <h3 class="section-title">DIAGNOSIS INFORMATION</h3>
            <p><strong>Primary:</strong> ${diagnosis.primaryDescription} (ICD-10: ${diagnosis.primaryCode})</p>
            ${diagnosis.secondaryDescription && diagnosis.secondaryCode ? `<p><strong>Secondary:</strong> ${diagnosis.secondaryDescription} (ICD-10: ${diagnosis.secondaryCode})</p>` : ''}
            <h3 class="section-title">SERVICES RENDERED</h3>
            <table><thead><tr><th>Date</th><th>Place</th><th>CPT</th><th>Description</th><th>Fee</th><th>Paid</th></tr></thead><tbody>${servicesHtml}</tbody></table>
            <h3 class="section-title">TOTALS</h3>
            <p><strong>Total Charges:</strong> $${totalCharges.toFixed(2)}<br><strong>Total Paid:</strong> $${totalAmountPaid.toFixed(2)}<br><strong>Balance Due:</strong> $${balanceDue.toFixed(2)}</p>
            <div class="footer-notes" style="margin-top:2rem; font-size:0.8em; border-top: 1px dashed #ccc; padding-top: 1rem;">
                <p>This statement is for insurance reimbursement. It is your responsibility to understand your benefits and submit this form to your insurance company.</p>
            </div>
            <p style="text-align: right; margin-top: 30px;"><strong>${providerFullName}</strong><br>Licensed Mental Health Therapist</p>`;
            
        $('#superbillOutput').html(superbillContent).removeClass('hidden');

        setTimeout(function() {
            $('html, body').animate({ 
                scrollTop: $('#superbillOutput').offset().top - 20 
            }, 500);
        }, 100);
    });

    $('#printSuperbill').on('click', function() {
        if (!$('#superbillOutput').is(':hidden')) {
            window.print();
        } else {
            alert("Please generate a superbill first.");
        }
    });

    $('#exportSuperbillJsonButton').on('click', function() {
        const formData = collectSuperbillFormData();
        const jsonString = JSON.stringify(formData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const clientName = formData.client.name ? formData.client.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'unknown_client';
        a.download = `superbill_data_${clientName}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    $('#importSuperbillJsonButton').on('click', () => $('#importSuperbillJsonFile').click());
    $('#importSuperbillJsonFile').on('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                        populateSuperbillForm(data);
                        alert('Superbill form data loaded successfully!');
                    } else {
                        alert('Invalid JSON file. Please ensure it contains a single client object.');
                    }
                } catch (error) {
                    console.error("Error parsing JSON file for superbill: ", error);
                    alert('Invalid JSON file for superbill.');
                } finally {
                    $(event.target).val('');
                }
            };
            reader.readAsText(file);
        }
    });

    function populateSuperbillForm(data) {
        $('#superbillServiceEntries').empty();
        superbillServiceCounter = 0;
        $('#superbillClientId').val(data.clientId || '');
        if (data.practice) {
            $('#superbillPracticeName').val(data.practice.name || '');
            $('#superbillPracticeAddress').val(data.practice.address || '');
            $('#superbillPracticeCityStateZip').val(data.practice.cityStateZip || '');
            $('#superbillPracticePhone').val(data.practice.phone || '');
            $('#superbillPracticeEmail').val(data.practice.email || '');
            $('#superbillPracticeWebsite').val(data.practice.website || '');
        }
        if (data.provider) {
            $('#superbillProviderName').val(data.provider.name || '');
            if(data.provider.credential) {
                 $(`input[name="providerCredential"][value="${data.provider.credential}"]`).prop('checked', true);
            }
            $('#superbillProviderLicense').val(data.provider.license || '');
            $('#superbillNpi').val(data.provider.npi || '');
        }
        if (data.client) {
            $('#superbillClientName').val(data.client.name || '');
            $('#superbillClientDOB').val(data.client.dob || '');
            $('#superbillClientAddress').val(data.client.address || '');
            $('#superbillClientCityStateZip').val(data.client.cityStateZip || '');
            $('#superbillClientPhone').val(data.client.phone || '');
            $('#superbillClientInsuranceId').val(data.client.insuranceId || '');
        }
        if (data.diagnosis) {
            $('#superbillPrimaryDiagnosisDescription').val(data.diagnosis.primaryDescription || '');
            $('#superbillPrimaryDiagnosisCode').val(data.diagnosis.primaryCode || '');
            $('#superbillSecondaryDiagnosisDescription').val(data.diagnosis.secondaryDescription || '');
            $('#superbillSecondaryDiagnosisCode').val(data.diagnosis.secondaryCode || '');
        }
        if (data.services && data.services.length > 0) {
            data.services.forEach(service => addSuperbillServiceEntry(service));
        } else {
            addSuperbillServiceEntry();
        }
        $('#superbillOutput').addClass('hidden');
        _currentClientSuperbillId = data.clientId || null;
    }

    $('#addNewClientButton').on('click', function() {
        saveCurrentSuperbillClient();
        $('#superbillForm').trigger('reset');
        _currentClientSuperbillId = simpleUniqueId();
        $('#superbillClientId').val(_currentClientSuperbillId);
        alert('Form cleared for a new client.');
    });

    $('#superbillForm').on('reset', function() {
        $('#superbillServiceEntries').empty();
        superbillServiceCounter = 0;
        addSuperbillServiceEntry();
        $('#superbillOutput').addClass('hidden');
        _currentClientSuperbillId = null;
        $('input[name="providerCredential"][value="LMHC"]').prop('checked', true);
    });

    function saveCurrentSuperbillClient() {
        const currentData = collectSuperbillFormData();
        if (!currentData.client.name && !_currentClientSuperbillId) return;
        if (!_currentClientSuperbillId) {
            _currentClientSuperbillId = simpleUniqueId();
            currentData.clientId = _currentClientSuperbillId;
            $('#superbillClientId').val(_currentClientSuperbillId);
        }
        const existingIndex = _allSuperbillClients.findIndex(client => client.clientId === _currentClientSuperbillId);
        if (existingIndex !== -1) {
            _allSuperbillClients[existingIndex] = currentData;
        } else {
            _allSuperbillClients.push(currentData);
        }
    }

    $('.collapsible-header').on('click', function() {
        $(this).toggleClass('collapsed').next('.collapsible-content').toggleClass('collapsed');
    });
});