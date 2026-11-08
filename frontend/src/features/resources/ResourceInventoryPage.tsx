import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourcesApi } from '../../api/resources.api';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { OperationalBadge } from '../../components/common/StatusBadge';
import { SEED_DISTRICTS } from '../../utils/constants';
import { ResourceRead, OperationalStatusEnum, ResourceTypeEnum } from '../../types';
import { Truck, Plus, Edit2, ShieldCheck, Activity } from 'lucide-react';

export const ResourceInventoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Edit capacity state
  const [editingResource, setEditingResource] = useState<ResourceRead | null>(null);
  const [editCapacity, setEditCapacity] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<OperationalStatusEnum>('OPERATIONAL');

  const { data: resourcesData, isLoading } = useQuery({
    queryKey: ['resources-inventory', selectedType, selectedDistrict, selectedStatus],
    queryFn: () =>
      resourcesApi.getResources({
        resource_type: selectedType !== 'all' ? selectedType : undefined,
        district_id: selectedDistrict !== 'all' ? selectedDistrict : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        page_size: 100,
      }),
  });

  const resources = resourcesData?.items || [];

  // Update resource mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => resourcesApi.updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-resources'] });
      setEditingResource(null);
    },
  });

  const handleEditOpen = (res: ResourceRead) => {
    setEditingResource(res);
    setEditCapacity(res.available_capacity);
    setEditStatus(res.operational_status);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;
    updateMutation.mutate({
      id: editingResource.id,
      data: {
        available_capacity: editCapacity,
        operational_status: editStatus,
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency Resource Logistics & Fleet Inventory"
        subtitle="Live tracking of ambulances, hospital trauma beds, medical strike teams, and community shelters"
      />

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="w-48">
          <Select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="all">All Resource Types</option>
            <option value="AMBULANCE">ALS Ambulances</option>
            <option value="HOSPITAL_BED">Hospital Beds</option>
            <option value="MEDICAL_TEAM">Medical Teams</option>
            <option value="TEMPORARY_SHELTER">Temporary Shelters</option>
            <option value="RELIEF_SUPPLY_PACK">Relief Packs</option>
          </Select>
        </div>

        <div className="w-48">
          <Select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
            <option value="all">All Districts</option>
            {Object.entries(SEED_DISTRICTS).map(([id, d]) => (
              <option key={id} value={id}>
                {d.name} ({d.state})
              </option>
            ))}
          </Select>
        </div>

        <div className="w-44">
          <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="OPERATIONAL">Operational</option>
            <option value="DEGRADED">Degraded</option>
            <option value="OFFLINE">Offline</option>
          </Select>
        </div>
      </div>

      {/* Resource Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            Loading real-time resource units...
          </div>
        ) : resources.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            No resource inventory matches current filters.
          </div>
        ) : (
          resources.map((res) => {
            const district = SEED_DISTRICTS[res.district_id];
            const loc = district ? `${district.name}, ${district.state}` : res.district_id;
            const pct = res.total_capacity > 0 ? Math.round((res.available_capacity / res.total_capacity) * 100) : 0;

            return (
              <Card key={res.id} className="flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-sky-600 uppercase font-semibold">
                      {res.resource_type.replace(/_/g, ' ')}
                    </span>
                    <CardTitle className="text-sm font-semibold truncate max-w-[200px]">
                      {res.name}
                    </CardTitle>
                    <p className="text-[11px] text-slate-500">📍 {loc}</p>
                  </div>
                  <OperationalBadge status={res.operational_status} />
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {/* Capacity Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-500">Available:</span>
                      <span className="font-bold text-slate-900">
                        {res.available_capacity} / {res.total_capacity} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct > 50 ? 'bg-emerald-500' : pct > 20 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-mono">
                      ID: {res.id.slice(0, 8)}...
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit2 className="w-3 h-3" />}
                      onClick={() => handleEditOpen(res)}
                    >
                      Update Capacity
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Capacity Dialog */}
      <Dialog
        isOpen={!!editingResource}
        onClose={() => setEditingResource(null)}
        title="Update Operational Resource Capacity"
        description={editingResource?.name}
      >
        {editingResource && (
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between text-slate-500">
                <span>Total Fleet Units:</span>
                <span className="text-slate-900 font-bold">{editingResource.total_capacity}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Type:</span>
                <span className="text-sky-600 font-medium">{editingResource.resource_type}</span>
              </div>
            </div>

            <Input
              label="Available Working Units"
              type="number"
              min="0"
              max={editingResource.total_capacity}
              value={editCapacity}
              onChange={(e) => setEditCapacity(parseInt(e.target.value) || 0)}
              required
            />

            <Select
              label="Operational Fleet Status"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as OperationalStatusEnum)}
            >
              <option value="OPERATIONAL">OPERATIONAL (Normal Service)</option>
              <option value="DEGRADED">DEGRADED (Partial Crew / Damaged)</option>
              <option value="OFFLINE">OFFLINE (Inaccessible / Road Block)</option>
            </Select>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingResource(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={updateMutation.isPending}>
                Save Fleet Update
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
};
