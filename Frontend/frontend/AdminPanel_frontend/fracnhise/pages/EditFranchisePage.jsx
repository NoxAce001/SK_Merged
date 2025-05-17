import React from 'react';
import EditFranchiseForm from '../Franchise/EditFranchiseForm'; // We'll create this next

function EditFranchisePage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-semibold text-black mb-8 text-center">Edit Franchise</h1>
        <EditFranchiseForm />
    </div>
  );
}

export default EditFranchisePage;
