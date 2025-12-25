"use client"

import dynamic from 'next/dynamic'
import React from 'react'

const ReactionSimulation = dynamic(() => import('../../components/chemistry/reactions/ReactionSimulation'), {
  ssr: false,
  loading: () => <p className="p-6">Loading reaction simulation…</p>,

})

export default function ChemistryPage() {
  return (
    <>
      <ReactionSimulation />
    </>
  )
}