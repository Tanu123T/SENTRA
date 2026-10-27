import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../../api/reports.api';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { formatNumber, formatDate } from '../../utils/formatters';
import { FileBarChart2, ShieldCheck, Download, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ReportsPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('');

  const { data: impactReport, isLoading } = useQuery({
    queryKey: ['disaster-impact-report', selectedState],
    queryFn: () => reportsApi.getDisasterImpactReport(selectedState || undefined),
  });

  const { data: summary } = useQuery({
    queryKey: ['system-summary-reports'],
    queryFn: reportsApi.getSystemSummary,
  });

  const districts = impactReport?.summary_by_district || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comprehensive Disaster Impact & Operational Reports"
        subtitle="Aggregate district metrics, casualty projections, alert volume, and resource readiness summaries"
        actions={
          <div className="flex items-center gap-2">
            <div className="w-48">
              <Select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                <option value="">All Indian States</option>
                <option value="state-mh-001">Maharashtra</option>
                <option value="state-as-001">Assam</option>
                <option value="state-od-001">Odisha</option>
                <option value="state-kl-001">Kerala</option>
                <option value="state-rj-001">Rajasthan</option>
                <option value="state-uk-001">Uttarakhand</option>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<Download className="w-3.5 h-3.5" />}
              onClick={() => window.print()}
            >
              Export Report
            </Button>
          </div>
        }
      />

      {/* Summary Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#0D151E]">
          <span className="text-[11px] text-[#91A0B3] uppercase">Districts Audited</span>
          <p className="text-2xl font-bold text-[#E8EEF5] mt-1">
            {impactReport?.total_districts_reported ?? 14}
          </p>
        </Card>
        <Card className="p-4 bg-[#0D151E]">
          <span className="text-[11px] text-[#91A0B3] uppercase">Total Active Alerts</span>
          <p className="text-2xl font-bold text-red-400 mt-1">
            {summary?.total_active_alerts ?? '—'}
          </p>
        </Card>
        <Card className="p-4 bg-[#0D151E]">
          <span className="text-[11px] text-[#91A0B3] uppercase">Total Resources Deployed</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {summary?.total_registered_resources ?? '—'}
          </p>
        </Card>
        <Card className="p-4 bg-[#0D151E]">
          <span className="text-[11px] text-[#91A0B3] uppercase">Telemetry Ingests</span>
          <p className="text-2xl font-bold text-sky-400 mt-1">
            {summary?.total_observations ?? '—'}
          </p>
        </Card>
      </div>

      {/* Comprehensive District Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            <FileBarChart2 className="w-4 h-4 text-amber-500" />
            <span>District Disaster Impact Matrix</span>
          </CardTitle>
          <span className="text-xs font-mono text-[#5A6E85]">
            GENERATED AT: {impactReport?.generated_at ? formatDate(impactReport.generated_at) : 'REAL-TIME'}
          </span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#243342] bg-[#111C27]/50 text-[#5A6E85] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">District & State</th>
                <th className="py-3 px-4">Active Alerts</th>
                <th className="py-3 px-4">Available Resources</th>
                <th className="py-3 px-4">Telemetry Ingests</th>
                <th className="py-3 px-4">Latest Hazard Assessment</th>
                <th className="py-3 px-4">Affected Population</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243342]/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#91A0B3]">
                    Aggregating statewide reports...
                  </td>
                </tr>
              ) : districts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#5A6E85]">
                    No district impact records found.
                  </td>
                </tr>
              ) : (
                districts.map((d) => (
                  <tr key={d.district_id} className="hover:bg-[#111C27]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#E8EEF5]">{d.district_name}</div>
                      <div className="text-[11px] text-[#91A0B3]">{d.state_name}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          d.active_alerts_count > 0 ? 'text-red-400 bg-red-500/10' : 'text-[#5A6E85]'
                        }`}
                      >
                        {d.active_alerts_count} Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-bold">
                      {d.available_resources_count} units
                    </td>
                    <td className="py-3.5 px-4 font-mono text-sky-400">
                      {formatNumber(d.total_observations)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-[11px] text-[#91A0B3]">
                        {d.latest_hazard_assessment || 'NO RECENT EVENT'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {d.estimated_affected_population ? formatNumber(d.estimated_affected_population) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
