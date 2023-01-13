import React, { useCallback, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { Button } from '@mui/material';
import BoxW from './BoxW';

const StyledCheckbox = (props) => {
  const { rowSize, colSize, selectedIndexes, selectedUsers, userData, setSelectedTag, caravanData, startIndex } = props;

  const baseMatrix = useMemo(() => Array(parseInt(rowSize, 10)).fill(Array(parseInt(colSize, 10)).fill(false)), [rowSize, colSize]);
  const [matrix, setMatrix] = useState(baseMatrix);

  useEffect(() => {
    const selectedTags = [];
    let i = 0;
    let j = 0;
    matrix.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col && i < selectedUsers.length) {
          if (Array.isArray(userData[selectedUsers[i].dataIndex]) && userData[selectedUsers[i].dataIndex].length > j) {
            selectedTags.push({
              rowIndex,
              colIndex,
              user: userData[selectedUsers[i].dataIndex][j],
              city: caravanData[selectedUsers[i].dataIndex].city,
              state: caravanData[selectedUsers[i].dataIndex].state,
            });
            j += 1;
          } else if (!Array.isArray(userData[selectedUsers[i].dataIndex])) {
            selectedTags.push({ rowIndex, colIndex, user: userData[selectedUsers[i].dataIndex] });
            i += 1;
          } else {
            i += 1;
          }
        }
      });
    });

    setSelectedTag(selectedTags);
  }, [caravanData, matrix, selectedUsers, setSelectedTag, userData]);

  useEffect(() => {
    let newMatrix;
    if (selectedIndexes) {
      const indexes = selectedIndexes.split(/[,;]/);
      let i = 0;

      newMatrix = baseMatrix.map((row, rowIndex) => {
        if (indexes[i]) {
          return row.map((col, colIndex) => {
            let condition = false;
            let lastOfInterval = false;

            if (indexes[i] && indexes[i].match(/\d+-\d+/)) {
              const [firstInterval, lastInterval] = indexes[i].split('-');
              lastOfInterval = rowIndex * row.length + colIndex + 1 === parseInt(lastInterval, 10);
              condition =
                rowIndex * row.length + colIndex + 1 >= parseInt(firstInterval, 10) &&
                rowIndex * row.length + colIndex + 1 <= parseInt(lastInterval, 10);
            } else if (indexes[i]) {
              condition = rowIndex * row.length + colIndex + 1 === parseInt(indexes[i], 10);
            }

            i += condition && (!indexes[i].match(/\d+-\d+/) || lastOfInterval) ? 1 : 0;
            return condition;
          });
        }
        return row.fill(false);
      });
    } else if (startIndex) {
      newMatrix = baseMatrix.map((row, rowIndex) => row.map((col, colIndex) => rowIndex * row.length + colIndex + 1 >= startIndex));
    } else {
      newMatrix = baseMatrix.map((row) => row.map(() => false));
    }
    setMatrix(_.clone(newMatrix));
  }, [baseMatrix, selectedIndexes, startIndex]);

  const handleChecked = useCallback(
    (checkedRow, checkedCol) => {
      const newMatrix = matrix.map((row, rowIndex) =>
        row.map((col, colIndex) => {
          if (colIndex === checkedCol && checkedRow === rowIndex) {
            return !col;
          }
          return col;
        })
      );

      setMatrix(_.clone(newMatrix));
    },
    [matrix]
  );

  return (
    <BoxW width="100%">
      {matrix.map((row, rowIndex) => (
        <BoxW width="100%" display="flex" flexDirection="row" alignItems="center">
          {row.map((col, colIndex) => (
            <Button
              fullWidth
              variant={col ? 'contained' : 'outlined'}
              onClick={() => {
                if (startIndex === '' && selectedIndexes === '') handleChecked(rowIndex, colIndex);
              }}
              sx={(theme) => ({
                borderRadius: '2px',
                borderColor: theme.palette.mode === 'dark' ? '#FFF' : '#000',
                height: '60px',
                margin: '1px',
              })}
            >
              {rowIndex * colSize + colIndex + 1}
            </Button>
          ))}
        </BoxW>
      ))}
    </BoxW>
  );
};

export default StyledCheckbox;
