import React, { Component } from 'react';
import Card from '@material/react-card';
import MaterialIcon from '@material/react-material-icon';
import TextField, { Input } from '@material/react-text-field';

import { Cell, Grid, Row } from '@material/react-layout-grid';
import { withRouter } from 'react-router-dom';
import type { ContextRouter } from 'react-router';
import { isFunction } from 'lodash';

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
  onReload?: () => void,
  search?: () => void,
  filters?: typeof Component
};

type Props = ComponentProps & ContextRouter;

class Table extends Component<Props, State> {
  state: State = {};

  static defaultProps: Props = {
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
    nextPage: null,
    search: null,
    filters: null
  };

  render() {
    const {
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
      onReload,
      search,
      filters
    } = this.props;
    const { searchText, searchTimeout } = this.state;
    return (
      <Card>
        <Grid align="left" className="full-width">
          <Row>
            <Cell
              columns={12 - (search ? 3 : 0) - (filters ? 6 : 0)}
              align="middle"
            >
              <h2 className={styles.tableTitle}>
                {title || `${totalCount} ${entityName}`}
              </h2>
            </Cell>
            {filters && (
              <Cell columns={6} align="middle">
                {filters}
              </Cell>
            )}
            {search && (
              <Cell columns={3} align="middle" className={styles.filters}>
                <TextField
                  outlined
                  onTrailingIconSelect={() => ''}
                  trailingIcon={
                    <MaterialIcon icon="search" className={styles.searchIcon} />
                  }
                >
                  <Input
                    value={searchText}
                    onChange={e => {
                      clearTimeout(searchTimeout);
                      this.setState({
                        searchText: e.currentTarget.value,
                        searchTimeout: setTimeout(() => {
                          const { searchText: text } = this.state;
                          search(text);
                        }, 200)
                      });
                    }}
                  />
                </TextField>
              </Cell>
            )}
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
                {fields.map(
                  (field, fieldIndex) =>
                    isFunction(field) ? (
                      <td key={`item-${item.id || index}-${fieldIndex}`}>
                        {field(item, index)}
                      </td>
                    ) : (
                      <td key={`item-${item.id || index}-${field}`}>
                        {parseField(item[field])}
                      </td>
                    )
                )}
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
  }
}

export default withRouter(Table);
