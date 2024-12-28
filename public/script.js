// filepath: /c:/Users/fgne/Desktop/Adria/Work/Portfolio - Personal Budget API/main/public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const envelopesContainer = document.getElementById('envelopes-container');
    const formContainer = document.getElementById('form-container');
    const addEnvelopeBtn = document.getElementById('add-envelope-btn');
    const transferMoneyBtn = document.getElementById('transfer-money-btn');
    const distributeMoneyBtn = document.getElementById('distribute-money-btn');

    const fetchEnvelopes = async () => {
        const response = await fetch('/envelopes');
        const envelopes = await response.json();
        displayEnvelopes(envelopes);
    };

    const displayEnvelopes = (envelopes) => {
        envelopesContainer.innerHTML = '';
        envelopes.forEach(envelope => {
            const envelopeDiv = document.createElement('div');
            envelopeDiv.className = 'envelope';
            envelopeDiv.innerHTML = `
                <h3>${envelope.title}</h3>
                <p>Budget: $${envelope.budget}</p>
                <button class="edit-btn" data-id="${envelope.id}">Edit</button>
                <button class="delete-btn" data-id="${envelope.id}">Delete</button>
            `;
            envelopesContainer.appendChild(envelopeDiv);
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                showEditForm(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                await fetch(`/envelopes/${id}`, {
                    method: 'DELETE'
                });
                fetchEnvelopes();
            });
        });
    };

    const showForm = (html) => {
        formContainer.innerHTML = html;
        formContainer.style.display = 'block';
    };

    const hideForm = () => {
        formContainer.style.display = 'none';
    };

    const showEditForm = async (id) => {
        const response = await fetch(`/envelopes/${id}`);
        const envelope = await response.json();
        showForm(`
            <h2>Edit Envelope</h2>
            <form id="edit-envelope-form">
                <input type="text" id="title" value="${envelope.title}" required>
                <input type="number" id="budget" value="${envelope.budget}" required>
                <button type="submit">Update</button>
                <button type="button" id="cancel-btn">Cancel</button>
            </form>
        `);

        document.getElementById('edit-envelope-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const budget = document.getElementById('budget').value;
            await fetch(`/envelopes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, budget })
            });
            hideForm();
            fetchEnvelopes();
        });

        document.getElementById('cancel-btn').addEventListener('click', hideForm);
    };

    addEnvelopeBtn.addEventListener('click', () => {
        showForm(`
            <h2>Add Envelope</h2>
            <form id="add-envelope-form">
                <input type="text" id="title" placeholder="Title" required>
                <input type="number" id="budget" placeholder="Budget" required>
                <button type="submit">Add</button>
                <button type="button" id="cancel-btn">Cancel</button>
            </form>
        `);

        document.getElementById('add-envelope-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const budget = document.getElementById('budget').value;
            await fetch('/envelopes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, budget })
            });
            hideForm();
            fetchEnvelopes();
        });

        document.getElementById('cancel-btn').addEventListener('click', hideForm);
    });

    transferMoneyBtn.addEventListener('click', () => {
        showForm(`
            <h2>Transfer Money</h2>
            <form id="transfer-money-form">
                <input type="number" id="from-id" placeholder="From Envelope ID" required>
                <input type="number" id="to-id" placeholder="To Envelope ID" required>
                <input type="number" id="amount" placeholder="Amount" required>
                <button type="submit">Transfer</button>
                <button type="button" id="cancel-btn">Cancel</button>
            </form>
        `);

        document.getElementById('transfer-money-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const fromId = document.getElementById('from-id').value;
            const toId = document.getElementById('to-id').value;
            const amount = document.getElementById('amount').value;
            await fetch(`/envelopes/transfer/${fromId}/${toId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount })
            });
            hideForm();
            fetchEnvelopes();
        });

        document.getElementById('cancel-btn').addEventListener('click', hideForm);
    });

    distributeMoneyBtn.addEventListener('click', () => {
        showForm(`
            <h2>Distribute Money</h2>
            <form id="distribute-money-form">
                <input type="number" id="amount" placeholder="Amount" required>
                <input type="text" id="envelope-ids" placeholder="Envelope IDs (comma separated)" required>
                <button type="submit">Distribute</button>
                <button type="button" id="cancel-btn">Cancel</button>
            </form>
        `);

        document.getElementById('distribute-money-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const amount = document.getElementById('amount').value;
            const envelopeIds = document.getElementById('envelope-ids').value.split(',').map(id => parseInt(id.trim()));
            await fetch('/envelopes/distribute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, envelopeIds })
            });
            hideForm();
            fetchEnvelopes();
        });

        document.getElementById('cancel-btn').addEventListener('click', hideForm);
    });

    fetchEnvelopes();
});