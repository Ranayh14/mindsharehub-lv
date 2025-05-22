import React from 'react';

export default function RightSidebar() {
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto w-64 p-3 hidden lg:block space-y-10">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded-full bg-gray-700 text-white"
        />
        <i className="fi fi-rr-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>

      {/* For You */}
      <div className="bg-[#2c2c2c] p-4 rounded-lg">
        <h2 className="font-semibold mb-3">For You</h2>
        <ul className="space-y-2">
          {['Bohongi Hati','Social anxiety','Overthinking','Stress'].map(cat => (
            <li key={cat} className="bg-[#3a3a3a] p-2 rounded cursor-pointer hover:bg-[#454545]">
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* User of The Week */}
      <div className="bg-[#2c2c2c] p-4 rounded-lg">
        <h2 className="font-semibold mb-3">User of The Week</h2>
        <ul className="space-y-2">
          {['User12345','User1234','User1345','User1245','User2345'].map((u, i) => (
            <li key={u} className="flex items-center gap-2">
              <span className="font-semibold w-4">{i+1}</span>
              <div className="w-6 h-6 bg-[#454545] rounded-full" />
              <span>{u}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Terms & Conditions */}
      <div className="text-center pt-[240px]">
        <button
          data-modal-toggle="static-modal"
          className="text-md hover:text-gray-300"
        >
          Terms &amp; Conditions
        </button>
        {/* Modal markup can go here or in a shared component */}
      </div>
    </aside>
  );
}
