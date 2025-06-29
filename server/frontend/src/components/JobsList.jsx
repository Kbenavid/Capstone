import React, { useEffect, useState } from 'react';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/jobs`, {
      credentials: 'include',
    })
      .then(r => r.json())
      .then(setJobs)
      .catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-2xl mb-4">Past Jobs</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.length === 0 ? (
          <p>No jobs recorded.</p>
        ) : (
          jobs.map(job => (
            <div
              key={job._id}
              className="p-4 rounded border border-gray-200 bg-white"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <strong>{job.customerName}</strong> (Van: {job.vanId})
                  <br />
                  {new Date(job.jobDate).toLocaleString()}
                </div>
                <div className="mt-2 sm:mt-0 text-right font-semibold">
                  Total: ${job.totalCost.toFixed(2)}
                </div>
              </div>

              <ul className="mt-2 space-y-1">
                {job.partsUsed.map((line, i) => (
                  <li key={i} className="text-sm">
                    {line.quantity} × {line.part.name} @ $
                    {line.unitPrice.toFixed(2)} = ${line.lineTotal.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
