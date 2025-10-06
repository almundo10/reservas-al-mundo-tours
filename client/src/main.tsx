import './lib/supabaseClient'  // conexión a Supabase
import './lib/autoSync'        // escucha el guardado local y sube a Supabase

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
