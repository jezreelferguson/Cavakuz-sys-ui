import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../components/AppShell'
import api from '../../../services/axios'

type InventoryItem = {
  id: number
  name: string
  category: string
  unit: string
  price: number
  stock: number
}

const fallbackInventory: InventoryItem[] = []

const asArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[]

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (Array.isArray(record.data)) return record.data as T[]
    if (Array.isArray(record.inventory)) return record.inventory as T[]
    if (Array.isArray(record.items)) return record.items as T[]
  }

  return []
}

const money = (value: number) => new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value)

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(fallbackInventory)
  const [selectedItemId, setSelectedItemId] = useState<number>(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const { data } = await api.get('/inventory')
        const nextInventory = asArray<InventoryItem>(data)
        if (nextInventory.length) {
          setInventory(nextInventory)
          setSelectedItemId(nextInventory[0].id)
        } else {
          setInventory([])
          setSelectedItemId(0)
        }
      } catch {
        setInventory(fallbackInventory)
      }
    }

    loadInventory()
  }, [])

  const selectedItem = useMemo(
    () => inventory.find((item) => item.id === selectedItemId) ?? inventory[0] ?? fallbackInventory[0],
    [inventory, selectedItemId]
  )

  const total = (selectedItem?.price ?? 0) * quantity

  return (
    <AppShell
      activePage="Services / Inventory"
      pageTitle="Services / Inventory"
      pageSubtitle="Track services, materials, and available stock levels."
      action={<Link to="/dashboard/inventory" className="add-record-btn">Add item</Link>}
    >
      <section className="module-grid">
        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Inventory catalogue</h2>
              <p>Track services and stock</p>
            </div>
          </div>

          <div className="inventory-list">
            {inventory.length ? inventory.map((item) => (
              <div className="inventory-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.category}</small>
                </div>
                <div>
                  <strong>{money(item.price)}</strong>
                  <small>{item.stock} in stock</small>
                </div>
                <div className="table-actions">
                  <button type="button" className="table-button view-button">View</button>
                  <button type="button" className="table-button edit-button">Edit</button>
                  <button type="button" className="table-button delete-button">Delete</button>
                </div>
              </div>
            )) : <p>No inventory items yet.</p>}
          </div>
        </div>

        <div className="panel module-panel">
          <div className="panel-heading">
            <div>
              <h2>Auto price calculator</h2>
              <p>Quantity × unit price</p>
            </div>
          </div>

          <div className="price-calculator">
            <label>
              <span>Inventory / service</span>
              <select value={selectedItemId} onChange={(event) => setSelectedItemId(Number(event.target.value))}>
                {inventory.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>

            <label>
              <span>Quantity</span>
              <input type="number" min={1} value={quantity} onChange={(event) => setQuantity(Number(event.target.value) || 1)} />
            </label>

            <div className="calculator-card">
              <span>Unit Price</span>
              <strong>{money(selectedItem?.price ?? 0)}</strong>
            </div>
            <div className="calculator-card primary">
              <span>Auto calculated total</span>
              <strong>{money(total)}</strong>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  )
}
