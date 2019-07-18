import React from 'react';
import Card from '@material/react-card';

import { Cell, Grid, Row } from '@material/react-layout-grid';

import './Table.css';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
const parseField = field => {
  if (field instanceof Date) return formatDate(field);
  return field;
};

const formatDate = field =>
  `${months[field.getMonth()]} ${field.getDay()}, ${field.getFullYear()}`;

type Props = {
  totalCount: number,
  items: [],
  columns: [],
  fields: [],
  entityName?: string,
  onClick?: () => void,
  title?: string,
  rowClassName?: () => [string],
  lastRow?: typeof Component
};

const Table = ({
  totalCount,
  items,
  columns,
  fields,
  entityName,
  onClick,
  title,
  rowClassName,
  lastRow
}: Props) => (
  <Card>
    <Grid align="left">
      <Row>
        <Cell cols={12}>
          <h2>{title || `${totalCount} ${entityName}`}</h2>
        </Cell>
      </Row>
    </Grid>
    <table>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr
            className={rowClassName(item)}
            key={`item-${item.id}`}
            onClick={() => onClick(item)}
          >
            {fields.map(field => (
              <td key={`item-${item.id}-${field}`}>
                {parseField(item[field])}
              </td>
            ))}
          </tr>
        ))}
        {lastRow}
      </tbody>
      <tfoot>
        <tr />
      </tfoot>
    </table>
  </Card>
);

Table.defaultProps = {
  onClick: () => {},
  title: null,
  entityName: '',
  rowClassName: () => {},
  lastRow: null
};

export default Table;
