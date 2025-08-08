interface GoogleMapProps {
  mapId: string
  title?: string
  className?: string
  height?: string
}

export default function GoogleMap({ 
  mapId, 
  title = "Map", 
  className = "",
  height = "400px"
}: GoogleMapProps) {
  // Convert the viewer URL to an embed URL
  const embedUrl = `https://www.google.com/maps/d/embed?mid=${mapId}&ehbc=2E312F`

  return (
    <div className={`rounded-lg overflow-hidden shadow-md ${className}`}>
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
        className="w-full"
      ></iframe>
    </div>
  )
}
