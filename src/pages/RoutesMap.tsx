import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { BUS_POSITIONS, ROUTES } from '../utils/mockData'

// Fix default marker icon issue with Vite
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const busIcon = L.divIcon({
  className: '',
  html: `<div style="font-size:22px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">🚌</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

const destinationIcon = L.divIcon({
  className: '',
  html: `<div style="width:12px;height:12px;background:#22C55E;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.4)"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
})

export default function RoutesMap() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ height: '480px' }}>
      <MapContainer
        center={[-1.2921, 36.8219]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Destination markers */}
        {ROUTES.map((route) => (
          route.coordinates && (
            <Marker
              key={route.id}
              position={route.coordinates[1] as [number, number]}
              icon={destinationIcon}
            >
              <Popup>
                <strong>{route.name}</strong><br />
                KES {route.price} · {route.duration}
              </Popup>
            </Marker>
          )
        ))}

        {/* Bus markers */}
        {BUS_POSITIONS.map((pos, i) => (
          <Marker key={i} position={pos} icon={busIcon}>
            <Popup>Bus #{i + 1} — Active</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
