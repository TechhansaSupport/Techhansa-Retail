import React from 'react'

export default function FranchisePartner() {
	return (
		<div className="w-full min-h-screen bg-[var(--soft-bg)] pb-20">
			<section className="max-w-4xl mx-auto px-6 py-24 text-center">
				<h1 className="text-4xl font-extrabold text-[var(--text-dark)] mb-4">Franchise Partners</h1>
				<p className="text-gray-600 mb-6">Become a Techhansa Retail franchisee and bring trusted IT products to your local market with comprehensive training and support.</p>

				<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white p-6 rounded-2xl shadow">Franchise Model</div>
					<div className="bg-white p-6 rounded-2xl shadow">Apply Now</div>
				</div>
			</section>
		</div>
	)
}
