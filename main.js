var gridOptions = {
  columnDefs: [
    { field: 'athlete', minWidth: 220, filter: 'agTextColumnFilter' },
    {
      field: 'country',
      minWidth: 200,
      filter: 'agSetColumnFilter',
      filterParams: {
        values: [
          'United States',
          'Ireland',
          'United Kingdom',
          'Russia',
          'Australia',
          'Canada',
          'Norway',
        ],
      },
    },
    { field: 'year', filter: 'agNumberColumnFilter' },
    { field: 'sport', minWidth: 200 },
    { field: 'gold' },
    { field: 'silver' },
    { field: 'bronze' },
  ],

  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },

  animateRows: true,

  rowModelType: 'serverSide',
  serverSideStoreType: 'full',
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  var gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);

  agGrid
    .simpleHttpRequest({
      url: 'https://www.ag-grid.com/example-assets/olympic-winners.json',
    })
    .then(function (data) {
      // setup the fake server with entire dataset
      var fakeServer = createFakeServer(data);

      // create datasource with a reference to the fake server
      var datasource = createServerSideDatasource(fakeServer);

      // register the datasource with the grid
      gridOptions.api.setServerSideDatasource(datasource);
    });
});

function createServerSideDatasource(server) {
  return {
    getRows: function (params) {
      console.log(
        '[Datasource] - rows requested by grid: startRow = ' +
          params.request.startRow +
          ', endRow = ' +
          params.request.endRow
      );

      // get data for request from our fake server
      var response = server.getData();

      // simulating real server call with a 500ms delay
      setTimeout(function () {
        if (response.success) {
          // supply rows for requested block to grid
          params.success({ rowData: response.rows });
        } else {
          params.fail();
        }
      }, 1000);
    },
  };
}

function createFakeServer(allData) {
  return {
    getData: function () {
      return {
        success: true,
        rows: allData,
      };
    },
  };
}
