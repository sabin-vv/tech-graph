const NotificationForm = () => {
  return (
    <div className="bg-surface space-y-2 p-6">
      <div className="border-border flex justify-between border p-3">
        <h2>In-app notofication</h2>
        <label>
          <input type="checkbox" />
        </label>
      </div>
      <div className="border-border flex justify-between border p-3">
        <h2>Email notification</h2>
        <label>
          <input type="checkbox" />
        </label>
      </div>
    </div>
  )
}
export default NotificationForm
