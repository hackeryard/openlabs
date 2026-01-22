export default function InfoPanel({ organ }: { organ: string }) {
  if (!organ) return (
    <div className="p-4 text-gray-500">
      Click on an organ
    </div>
  )

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{organ}</h2>
      <p className="mt-2 text-sm">
        {organ} is an important biological structure.
        (You can replace this with real data.)
      </p>
    </div>
  )
}
