document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('calculatorForm');
    const table = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];

    // Load previous results from local storage
    const previousResults = JSON.parse(localStorage.getItem('results')) || [];
    previousResults.forEach(result => {
        addRowToTable(result);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const monthlyRent = parseFloat(form.monthlyRent.value) || null;
        var annualRent = parseFloat(form.annualRent.value) || null;
        const propertyCost = parseFloat(form.propertyCost.value) || null;
        const rentalYield = parseFloat(form.rentalYield.value) || null;

        if (monthlyRent === null) {
            form.monthlyRent.value = (annualRent / 12);
        } else if (annualRent === null) {
            form.annualRent.value = (monthlyRent * 12);
        }

        if (propertyCost === null) {
            if (monthlyRent !== null && rentalYield !== null) {
                annualRent = monthlyRent * 12;
            }
            form.propertyCost.value = Math.round(annualRent / (rentalYield / 100));
        } else if (rentalYield === null) {
            form.rentalYield.value = ((annualRent / propertyCost) * 100).toFixed(2);
        }

        const result = {
            monthlyRent: form.monthlyRent.value,
            annualRent: form.annualRent.value,
            propertyCost: form.propertyCost.value,
            rentalYield: form.rentalYield.value
        };

        /* 
         * COMMENTED else it saves directly to table after user clicks calculate button
        // Add result to table
        addRowToTable(result);

        // Save result to local storage
        previousResults.push(result);
        localStorage.setItem('results', JSON.stringify(previousResults));
        */
    });

    const saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', (event) => {
        event.preventDefault();

        const result = {
            monthlyRent: form.monthlyRent.value,
            annualRent: form.annualRent.value,
            propertyCost: form.propertyCost.value,
            rentalYield: form.rentalYield.value
        };

        // Add result to table
        addRowToTable(result);

        // Save result to local storage
        previousResults.push(result);
        localStorage.setItem('results', JSON.stringify(previousResults));
    });

    function addRowToTable(result, index) {
        const row = table.insertRow();
        row.insertCell().innerText = formatNumber(result.monthlyRent);
        row.insertCell().innerText = formatNumber(result.annualRent);
        row.insertCell().innerText = formatNumber(result.propertyCost);
        row.insertCell().innerText = formatNumber(result.rentalYield);
        const deleteCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'btn btn-danger';
        deleteButton.addEventListener('click', () => {
            // Remove result from table
            table.deleteRow(index);

            // Remove result from local storage
            previousResults.splice(index, 1);
            localStorage.setItem('results', JSON.stringify(previousResults));
        });
        deleteCell.appendChild(deleteButton);

        const nameCell = row.insertCell();
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'form-control';
        nameInput.value = result.name || '';
        nameInput.addEventListener('change', () => {
            result.name = nameInput.value;
            saveResults();
        });
        nameCell.appendChild(nameInput);
        const addressCell = row.insertCell();
        const addressInput = document.createElement('input');
        addressInput.type = 'text';
        addressInput.className = 'form-control';
        addressInput.value = result.address || '';
        addressInput.addEventListener('change', () => {
            result.address = addressInput.value;
            saveResults();
        });
        addressCell.appendChild(addressInput);
        const tagsCell = row.insertCell();
        const tagsInput = document.createElement('input');
        tagsInput.type = 'text';
        tagsInput.className = 'form-control';
        tagsInput.value = result.tags || '';
        tagsInput.addEventListener('change', () => {
            result.tags = tagsInput.value;
            saveResults();
        });
        tagsCell.appendChild(tagsInput);
    }

    function saveResults() {
        localStorage.setItem('results', JSON.stringify(previousResults));
    }



    function formatNumber(num) {
        var x = num.toString();
        var afterPoint = '';
        if (x.indexOf('.') > 0)
            afterPoint = x.substring(x.indexOf('.'), x.length);
        x = Math.floor(x);
        x = x.toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    }

});
