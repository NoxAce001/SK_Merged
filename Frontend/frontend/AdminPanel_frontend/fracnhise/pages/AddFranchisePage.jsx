import React from 'react';
import AddFranchiseForm from '../Franchise/AddFranchiseForm'; // Corrected path

function AddFranchisePage() {
  return (
    // Removed outer container div and styling, form component handles its own box style
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <AddFranchiseForm />
    </div>
  );
}

export default AddFranchisePage;
