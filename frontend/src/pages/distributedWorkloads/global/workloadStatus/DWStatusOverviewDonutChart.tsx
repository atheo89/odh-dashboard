import * as React from 'react';
import { ChartDonut, ChartLegend } from '@patternfly/react-charts';
import EmptyStateErrorMessage from '~/components/EmptyStateErrorMessage';
import { DistributedWorkloadsContext } from '~/concepts/distributedWorkloads/DistributedWorkloadsContext';
import {
  WorkloadStatusColorAndIcon,
  WorkloadStatusType,
  getStatusCounts,
} from '~/concepts/distributedWorkloads/utils';
import { LoadingState } from '~/pages/distributedWorkloads/components/LoadingState';

export const DWStatusOverviewDonutChart: React.FC = () => {
  const { workloads } = React.useContext(DistributedWorkloadsContext);

  const statusCounts = React.useMemo(() => getStatusCounts(workloads.data), [workloads.data]);

  if (workloads.error) {
    return (
      <EmptyStateErrorMessage
        title="Error loading distributed workloads"
        bodyText={workloads.error.message}
      />
    );
  }

  if (!workloads.loaded) {
    return <LoadingState />;
  }

  const statusTypesIncludedInLegend = Object.values(WorkloadStatusType);
  const statusTypesIncludedInChart = statusTypesIncludedInLegend.filter(
    (statusType) => statusCounts[statusType] > 0,
  );

  return (
    <ChartDonut
      ariaDesc="Distributed workload status overview"
      ariaTitle="Status overview donut chart"
      constrainToVisibleArea
      data={statusTypesIncludedInChart.map((statusType) => ({
        x: statusType,
        y: statusCounts[statusType],
      }))}
      labels={({ datum }) => `${datum.x}: ${datum.y}`}
      colorScale={statusTypesIncludedInChart.map(
        (statusType) => WorkloadStatusColorAndIcon[statusType].chartColor,
      )}
      legendComponent={
        <ChartLegend
          data={statusTypesIncludedInLegend.map((statusType) => ({
            name: `${statusType}: ${statusCounts[statusType]}`,
          }))}
          colorScale={statusTypesIncludedInLegend.map(
            (statusType) => WorkloadStatusColorAndIcon[statusType].chartColor,
          )}
          gutter={15}
          itemsPerRow={Math.ceil(statusTypesIncludedInLegend.length / 2)}
          rowGutter={0}
        />
      }
      legendOrientation="vertical"
      legendPosition="right"
      name="status-overview"
      padding={{
        bottom: 0,
        left: 0,
        right: 280, // Adjusted to accommodate legend
        top: 0,
      }}
      subTitle="Distributed Workloads"
      title={String(workloads.data.length)}
      width={450}
      height={150}
    />
  );
};
