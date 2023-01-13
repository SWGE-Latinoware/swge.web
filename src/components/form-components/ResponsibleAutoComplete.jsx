import React from 'react';
import AutoCompleteW from '../wrapper/AutoCompleteW';
import useGridCoordinator from '../hook/useGridCoordinator';

const ResponsibleAutoComplete = (props) => {
  const { gridCoordinatorIds, getGridCoordinatorNameById } = useGridCoordinator();
  return <AutoCompleteW options={gridCoordinatorIds || []} getOptionLabel={(o) => getGridCoordinatorNameById(o)} {...props} />;
};

export default ResponsibleAutoComplete;
