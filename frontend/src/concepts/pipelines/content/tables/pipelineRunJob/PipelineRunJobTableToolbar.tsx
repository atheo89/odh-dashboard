import * as React from 'react';
import { Button, TextInput, ToolbarItem } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';
import PipelineFilterBar from '~/concepts/pipelines/content/tables/PipelineFilterBar';
import RunTableToolbarActions from '~/concepts/pipelines/content/tables/RunTableToolbarActions';
import { usePipelinesAPI } from '~/concepts/pipelines/context';
import { FilterOptions } from '~/concepts/pipelines/content/tables/usePipelineFilter';

const options = {
  [FilterOptions.NAME]: 'Name',
  // [FilterOptions.EXPERIMENT]: 'Experiment',
  // [FilterOptions.PIPELINE_VERSION]: 'Pipeline version',
};

export type FilterProps = Pick<
  React.ComponentProps<typeof PipelineFilterBar>,
  'filterData' | 'onFilterUpdate' | 'onClearFilters'
>;

type PipelineRunJobTableToolbarProps = React.ComponentProps<typeof RunTableToolbarActions> &
  FilterProps;

const PipelineRunJobTableToolbar: React.FC<PipelineRunJobTableToolbarProps> = ({
  deleteAllEnabled,
  onDeleteAll,
  ...toolbarProps
}) => {
  const navigate = useNavigate();
  const { namespace } = usePipelinesAPI();

  return (
    <PipelineFilterBar<keyof typeof options>
      {...toolbarProps}
      filterOptions={options}
      filterOptionRenders={{
        [FilterOptions.NAME]: ({ onChange, ...props }) => (
          <TextInput
            {...props}
            aria-label="Search for a scheduled run name"
            placeholder="Scheduled run name"
            onChange={(event, value) => onChange(value)}
          />
        ),
        // pipelines kfv2 does not let us filter by experiment.
        // [FilterOptions.EXPERIMENT]: ({ onChange, value, label }) => (
        //   <ExperimentSearchInput
        //     onChange={(data) => onChange(data?.value, data?.label)}
        //     selected={value && label ? { value, label } : undefined}
        //   />
        // ),
        // Pipelines KFv2 does not let us filter by pipeline version.
        // [FilterOptions.PIPELINE_VERSION]: ({ onChange, label }) => (
        //   <PipelineVersionSelect
        //     versions={versions}
        //     selection={label}
        //     onSelect={(version) => onChange(version.pipeline_version_id, version.display_name)}
        //   />
        // ),
      }}
    >
      <ToolbarItem>
        <Button
          variant="secondary"
          onClick={() => navigate(`/pipelineRuns/${namespace}/pipelineRun/create`)}
        >
          Create run
        </Button>
      </ToolbarItem>
      <ToolbarItem data-testid="job-table-toolbar-item">
        <RunTableToolbarActions deleteAllEnabled={deleteAllEnabled} onDeleteAll={onDeleteAll} />
      </ToolbarItem>
    </PipelineFilterBar>
  );
};

export default PipelineRunJobTableToolbar;
