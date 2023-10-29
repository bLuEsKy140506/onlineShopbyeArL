// pages/dashboard.js

import { withAuth } from "../auth";

function Dashboard() {
  return <div>Your Dashboard Content</div>;
}

export default withAuth(Dashboard);
