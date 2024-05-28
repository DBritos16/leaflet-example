import './App.css'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css'
import { Circle, FeatureGroup, LayersControl, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { useRef, useState } from 'react';

function App() {

  const mapRef = useRef(null);

  const [layers, setLayers] = useState([]);

  const onCreate = (e) => {
    
    const { layerType, layer } = e;

    const nombre = prompt('Ingrese el nombre');
    
    setLayers(prev => [...prev, { id: layer._leaflet_id, nombre, type: layerType, coords: layer.getLatLng() }])

  }


  const flyTo = (coords) => mapRef.current.flyTo(coords, 15);

  const onEdit = ({layers})=>{

    const editedLayers = layers.getLayers();

    editedLayers.forEach( editedLayer => setLayers( prev => prev.map( layer => editedLayer.options.id === layer.id ? {...layer, coords: editedLayer.getLatLng()} : layer)));
    
  }

  const onDelete = (e)=>{
    e.layers.getLayers().forEach(deleteLayer => setLayers(prev => prev.filter( layer => layer.id !== deleteLayer.options.id)))
  }

  return (
    <main>
      <nav>
        <h1>Leaflet example</h1>
      </nav>

      <section>
        <div className='map-container'>

          <MapContainer center={[-26.1852, -58.1744]} zoom={13} ref={mapRef}>
            
            <LayersControl>
              <LayersControl.BaseLayer checked name='Mapa 2D'>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors c'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>

              <LayersControl.BaseLayer name='Satelital'>
                <TileLayer
                  attribution='&copy; Esri &mdash; Sources: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  url="https://khms0.google.com/kh/v=979?x={x}&y={y}&z={z}"
                />
              </LayersControl.BaseLayer>

            </LayersControl>

            <FeatureGroup key={layers}>
              <EditControl
                onCreated={onCreate}
                onEdited={onEdit}
                onDeleted={onDelete}
                draw={{
                  marker: true,
                  circle: false,
                  rectangle: false,
                  circlemarker: false,
                  polyline: false,
                  polygon: false
                }}
              />

              {layers.map( layer => (
                layer.type === 'marker' 
                ? <Marker position={layer.coords} id={layer.id} key={layer.id}>
                    <Popup>{layer.nombre}</Popup>
                  </Marker> 
                : <Circle center={layer.coords} id={layer.id} radius={layer.radius}/>
              ))}
            </FeatureGroup>
      
          </MapContainer>
        </div>
        <div className='layers'>
          <h1>Marcadores</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Coords</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {layers.map( (layer, i) => (
                <tr key={i}>
                  <td>{layer?.nombre}</td>
                  <td>{JSON.stringify(layer.coords)}</td>
                  <td><button type='button' onClick={()=>flyTo(layer.coords)}>Ir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default App
