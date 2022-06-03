/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound, LoadingIndicatorPage, CheckPagePermissions } from '@strapi/helper-plugin';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import pluginPermissions from '../../permissions';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';
import { PgMetadataProvider } from '../../contexts';

const App = () => {
  const { formatMessage } = useIntl();

  const title = formatMessage({
    id: `${pluginId}.plugin.name`,
    defaultMessage: 'PostGIS Content Manager',
  });
  return (
    <PgMetadataProvider>
      <CheckPagePermissions permissions={pluginPermissions.readSettings}>
        <Helmet title={title} />
        {/* <FormModalNavigationProvider>
        <DataManagerProvider allIcons={icons}>
          <Layout sideNav={<ContentTypeBuilderNav />}>
            <Suspense fallback={<LoadingIndicatorPage />}>
              <Switch>
                <Route
                  path={`/plugins/${pluginId}/content-types/create-content-type`}
                  component={ListView}
                />
                <Route path={`/plugins/${pluginId}/content-types/:uid`} component={ListView} />
                <Route
                  path={`/plugins/${pluginId}/component-categories/:categoryUid`}
                  component={RecursivePath}
                />
              </Switch>
            </Suspense>
          </Layout>
        </DataManagerProvider>
      </FormModalNavigationProvider> */}
        <Switch>
          <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
          <Route path={`/plugins/${pluginId}/:uiid`} component={HomePage} exact />
          <Route component={NotFound} />
        </Switch>
      </CheckPagePermissions>


    </PgMetadataProvider>
  );
};

export default App;
