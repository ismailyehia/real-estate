import { useAuth } from "@/hooks/use-auth";
import { useAdminStats, useAdminUsers, useUpdateUserRoleHook, useDeleteUserHook } from "@/hooks/use-admin";
import { useProperties, useDeletePropertyHook } from "@/hooks/use-properties";
import { Building, Users, Eye, TrendingUp, Plus, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";
import { format } from "date-fns";

export function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }
  
  if (user?.role === 'agent') {
    return <AgentDashboard agentId={user.id} />;
  }

  return <div className="p-8 text-center">Unauthorized. Only Agents and Admins have dashboards.</div>;
}

function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  
  if (statsLoading || usersLoading) return <div className="p-12 text-center animate-pulse">Loading dashboard...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-display font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Properties" value={stats?.totalProperties || 0} icon={<Building className="w-6 h-6" />} trend="+12%" />
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<Users className="w-6 h-6" />} trend="+4%" />
        <StatCard title="Active Agents" value={stats?.totalAgents || 0} icon={<TrendingUp className="w-6 h-6" />} trend="+2%" />
        <StatCard title="Property Views" value={stats?.totalViews || 0} icon={<Eye className="w-6 h-6" />} trend="+24%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-sm uppercase tracking-wider">
                      <th className="pb-3 font-semibold">User</th>
                      <th className="pb-3 font-semibold">Email</th>
                      <th className="pb-3 font-semibold">Role</th>
                      <th className="pb-3 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {users?.slice(0, 10).map(u => (
                      <tr key={u.id}>
                        <td className="py-4 font-medium">{u.name}</td>
                        <td className="py-4 text-muted-foreground">{u.email}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-primary text-white' : u.role === 'agent' ? 'bg-accent/20 text-accent' : 'bg-secondary text-secondary-foreground'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 text-muted-foreground text-sm">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.recentProperties.slice(0, 5).map(prop => (
                  <div key={prop.id} className="flex gap-4 items-center">
                    <img src={prop.images[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold line-clamp-1">{prop.title}</h4>
                      <p className="text-sm text-primary font-semibold">{formatPrice(prop.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AgentDashboard({ agentId }: { agentId: number }) {
  // We can filter properties by agentId if the API supports it. 
  // Assuming useProperties can take an agentId param, but schema doesn't show it explicitly in ListPropertiesParams.
  // We'll fetch all and filter client side for now as a fallback, or assume the agent only sees theirs.
  const { data, isLoading } = useProperties({ limit: 50 });
  const deleteMutation = useDeletePropertyHook();
  
  const myProperties = data?.properties.filter(p => p.agentId === agentId) || [];

  if (isLoading) return <div className="p-12 text-center animate-pulse">Loading properties...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-10 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-display font-bold mb-2">Agent Dashboard</h1>
          <p className="text-muted-foreground">Manage your property listings.</p>
        </div>
        <Link href="/properties/new">
          <Button className="flex items-center gap-2"><Plus className="w-4 h-4" /> Add Listing</Button>
        </Link>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {myProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-secondary/50">
                <tr className="text-muted-foreground text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Property</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Views</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {myProperties.map(prop => (
                  <tr key={prop.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img src={prop.images[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"} alt="" className="w-16 h-16 rounded-xl object-cover" />
                        <div>
                          <Link href={`/properties/${prop.id}`} className="font-bold hover:text-primary transition-colors block mb-1">{prop.title}</Link>
                          <span className="text-xs text-muted-foreground">{prop.city} • {prop.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${prop.status === 'for_sale' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'}`}>
                        {prop.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{formatPrice(prop.price)}</td>
                    <td className="p-4 text-muted-foreground flex items-center gap-1 mt-3"><Eye className="w-4 h-4" /> {prop.viewCount}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/properties/${prop.id}/edit`}>
                          <Button variant="outline" size="icon" className="h-8 w-8 text-primary"><Edit className="w-4 h-4" /></Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 text-destructive border-destructive/20 hover:bg-destructive hover:text-white"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this property?")) {
                              deleteMutation.mutate({ id: prop.id });
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-muted-foreground">
            <Building className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg">You haven't listed any properties yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: number | string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full transition-transform group-hover:scale-150 duration-500"></div>
      <div className="text-muted-foreground mb-4 relative z-10 flex justify-between items-start">
        <span className="font-semibold">{title}</span>
        <div className="p-2 bg-secondary rounded-xl text-primary">{icon}</div>
      </div>
      <div className="flex items-end gap-3 relative z-10">
        <span className="text-3xl font-display font-bold text-foreground">{value}</span>
        <span className="text-sm font-bold text-emerald-500 mb-1">{trend}</span>
      </div>
    </div>
  );
}
