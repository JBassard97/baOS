import "./settings.scss";
import { useEffect, useState } from "react";
import { sendNotification } from "../../helpers/sendNotification";

type PermissionState = "granted" | "denied" | "prompt" | "unsupported";

export default function Settings() {
  const [permissions, setPermissions] = useState({
    camera: "prompt" as PermissionState,
    microphone: "prompt" as PermissionState,
    notifications: "prompt" as PermissionState,
  });

  useEffect(() => {
    updatePermissions();
  }, []);

  async function updatePermissions() {
    try {
      const camera = await navigator.permissions.query({
        name: "camera" as PermissionName,
      });

      const microphone = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      const notifications = await navigator.permissions.query({
        name: "notifications" as PermissionName,
      });

      setPermissions({
        camera: camera.state,
        microphone: microphone.state,
        notifications: notifications.state,
      });

      // update if browser changes permissions externally
      camera.onchange = () =>
        setPermissions((p) => ({
          ...p,
          camera: camera.state,
        }));

      microphone.onchange = () =>
        setPermissions((p) => ({
          ...p,
          microphone: microphone.state,
        }));

      notifications.onchange = () =>
        setPermissions((p) => ({
          ...p,
          notifications: notifications.state,
        }));
    } catch (err) {
      console.error(err);
    }
  }

  async function enableCamera() {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      updatePermissions();
    } catch {}
  }

  async function enableMicrophone() {
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      updatePermissions();
    } catch {}
  }

  async function enableNotifications() {
    await Notification.requestPermission();
    updatePermissions();
  }

  function statusLabel(status: PermissionState) {
    switch (status) {
      case "granted":
        return "Granted ✓";
      case "denied":
        return "Denied";
      case "prompt":
        return "Awaiting Prompt";
      default:
        return "Unknown";
    }
  }

  return (
    <div className="settings">
      <h1 className="settings-header">Settings</h1>

      <details name="settings">
        <summary>Appearance</summary>
      </details>

      <details name="settings">
        <summary>Permissions</summary>

        <div className="permission-list">
          <div className="permission-row" onClick={enableCamera}>
            <div>
              <strong>Camera</strong>
            </div>

            <span>Status: [{statusLabel(permissions.camera)}]</span>
          </div>

          <div className="permission-row" onClick={enableMicrophone}>
            <div>
              <strong>Microphone</strong>
            </div>

            <span>Status: [{statusLabel(permissions.microphone)}]</span>
          </div>

          <div className="permission-row" onClick={enableNotifications}>
            <div>
              <strong>Notifications</strong>
              {permissions.notifications === "granted" && (
                <button
                  onClick={() => {
                    sendNotification("baOS", { body: "Testing!" });
                  }}
                >
                  Test
                </button>
              )}
            </div>

            <span>Status: [{statusLabel(permissions.notifications)}]</span>
          </div>
        </div>
      </details>
    </div>
  );
}
