import React from 'react';
import Card from '@material/react-card';
import MaterialIcon from '@material/react-material-icon';

import { Cell, Grid, Row } from '@material/react-layout-grid';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';

import styles from './Table.scss';

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

type ComponentProps = {
  totalCount: number,
  items: [],
  columns: [],
  fields: [],
  entityName?: string,
  onClick?: () => void,
  title?: string,
  rowClassName?: () => [string],
  lastRow?: typeof Component,
  pagination?: boolean,
  nextPage?: number | null,
  prevPage?: number | null,
  offset?: number | null,
  limit?: number | null,
  onReload?: () => void
};

type Props = ComponentProps & ContextRouter;

const Table = ({
  totalCount,
  items,
  columns,
  fields,
  entityName,
  onClick,
  title,
  rowClassName,
  lastRow,
  pagination,
  prevPage,
  nextPage,
  offset,
  limit,
  history,
  onReload
}: Props) => (
  <Card>
    <Grid align="left">
      <Row>
        <Cell cols={12}>
          <h2 className={styles.tableTitle}>
            {title || `${totalCount} ${entityName}`}
          </h2>
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
        {items.map((item, index) => (
          <tr
            className={rowClassName(item)}
            key={`item-${item.id || index}`}
            onClick={() => onClick(item)}
          >
            {fields.map(field => (
              <td key={`item-${item.id || index}-${field}`}>
                {parseField(item[field])}
              </td>
            ))}
          </tr>
        ))}
        {lastRow}
      </tbody>
    </table>
    {pagination && (
      <div className={styles.tablePagination}>
        {`${Math.min(offset + 1, totalCount)} - ${Math.min(
          offset + limit,
          totalCount
        )} `}
        of {totalCount}
        <a
          href=""
          className={prevPage ? 'cursor-pointer' : styles.disabled}
          onClick={e => {
            e.preventDefault();
            if (!prevPage) return;
            history.push({ search: `page=${prevPage}` });
            onReload();
          }}
        >
          <MaterialIcon icon="keyboard_arrow_left" />
        </a>
        <a
          href=""
          className={nextPage ? 'cursor-pointer' : styles.disabled}
          onClick={e => {
            e.preventDefault();
            if (!nextPage) return;
            history.push({ search: `page=${nextPage}` });
            onReload();
          }}
        >
          <MaterialIcon icon="keyboard_arrow_right" />
        </a>
      </div>
    )}
  </Card>
);

Table.defaultProps = {
  onClick: () => {},
  title: null,
  entityName: '',
  rowClassName: () => {},
  lastRow: null,
  pagination: false,
  offset: null,
  limit: null,
  onReload: () => {},
  prevPage: null,
  nextPage: null
};

export default withRouter(Table);
