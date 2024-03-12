/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const categories = categoriesFromServer.find(
    (category) => category.id === product.categoryId
  );
  const users = categories
    ? usersFromServer.find((user) => user.id === categories.ownerId)
    : null;

  return {
    ...product,
    categories,
    users,
  };
});

export const App = () => {
  const [selectUser, setSelectUser] = useState('All');
  const [search, setSearch] = useState('');
  const [selectCategory, setSelectCategory] = useState([]);

  let visibleProducts = [...products];

  if (selectUser !== 'All') {
    visibleProducts = visibleProducts.filter(
      (product) => product.users.name === selectUser
    );
  }

  if (search) {
    visibleProducts = visibleProducts.filter((product) =>
      product.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }

  if (selectCategory.length) {
    visibleProducts = visibleProducts.filter((product) =>
      selectCategory.includes(product.categories.title)
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectUser('All')}
                className={selectUser === 'All' ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map((user) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectUser(user.name)}
                  className={selectUser === user.name ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {search && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearch('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectCategory([])}
              >
                All
              </a>

              {categoriesFromServer.map((category) => (
                <a
                  data-cy="Category"
                  // className="button mr-2 my-1 is-info"
                  className={cn('button mr-2 my-1', {
                    'is-info': selectCategory.includes(category.title),
                  })}
                  href="#/"
                  onClick={() => {
                    if (!selectCategory.includes(category.title)) {
                      setSelectCategory([...selectCategory, category.title]);
                    } else {
                      setSelectCategory(
                        selectCategory.filter(
                          (product) => product !== category.title
                        )
                      );
                    }
                  }}
                  // className={selectCategory === category.title ? 'is-info' : ''}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSelectUser('All');
                  setSearch('');
                  setSelectCategory([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleProducts.map((product) => (
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">{`${product.categories.icon} - ${product.categories.title}`}</td>
                  {/* className="has-text-link" */}
                  {/* className={cn ('has-text-link {
                  'has-text-danger' : product.users.sex != 'm'
                })} */}
                  <td
                    data-cy="ProductUser"
                    className={
                      product.users.sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'
                    }
                  >
                    {product.users.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
