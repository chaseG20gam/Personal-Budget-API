Personal Budget Web Application

This web application allows you to manage your budget envelopes. You can create, update, delete, transfer money between envelopes, and distribute a balance to multiple envelopes.

To run this Node.js project, you need to follow these steps: 

1. **Install Node.js and npm**: Ensure that Node.js and npm (Node Package Manager) are installed on your machine.

2. **Navigate to the Project Directory**: Open a terminal and navigate to the root directory of your project.

3. **Install Dependencies**: Run the following command to install the project dependencies listed in the package.json file:

    ```sh
    npm install
    ```

4. **Start the Application**: Once the dependencies are installed, you can start the application. The command to start the application is usually defined in the scripts section of the package.json file. Also you can run the application like this:

    ```sh
    npm start
    ```

5. **Verify the Application is Running**: Open a web browser and navigate to 'http://localhost:3000' to verify that the application is running.

6. The main page will display all your budget envelopes.

7. To add a new envelope:
   - Click the "Add Envelope" button.
   - Fill in the "Title" and "Budget" fields.
   - Click the "Add" button to create the new envelope.

8. To transfer money between envelopes:
   - Click the "Transfer Money" button.
   - Fill in the "From Envelope ID", "To Envelope ID", and "Amount" fields.
   - Click the "Transfer" button to transfer the specified amount from one envelope to another.

9. To distribute money to multiple envelopes:
   - Click the "Distribute Money" button.
   - Fill in the "Amount" and "Envelope IDs" (comma-separated) fields.
   - Click the "Distribute" button to distribute the specified amount across the specified envelopes.

10. To update an envelope:
   - Click on the envelope you want to update.
   - Modify the "Title" or "Budget" fields as needed.
   - Click the "Update" button to save the changes.

11. To delete an envelope:
   - Click on the envelope you want to delete.
   - Click the "Delete" button to remove the envelope.
