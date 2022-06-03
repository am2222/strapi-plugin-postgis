/*
 *
 * HomePage
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Allotment } from "allotment";
import "allotment/dist/style.css";


import pluginId from '../../pluginId';
import { Helmet } from 'react-helmet';
import { Switch, Route, useParams, useRouteMatch, Redirect, useLocation } from 'react-router-dom';
import { CheckPagePermissions, LoadingIndicatorPage, NotFound } from '@strapi/helper-plugin';
import { Layout, HeaderLayout, BaseHeaderLayout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { IconButton } from '@strapi/design-system/IconButton';
import { Typography } from '@strapi/design-system/Typography';
import { Flex   } from '@strapi/design-system/Flex';
import { BaseCheckbox  } from '@strapi/design-system/BaseCheckbox';
import { Avatar   } from '@strapi/design-system/Avatar';
import { Main } from '@strapi/design-system/Main';
import { useIntl } from 'react-intl';
import sortBy from 'lodash/sortBy';
import axios from '../../utils/axiosInstance'
import getRequestURL from '../../utils/getRequestURL'
import LeftMenu from '../../components/LeftMenu';
import MainMap from '../../components/MainMap';
import { useFetchPgMetadata } from "../../hooks/";
import { toTitleCase } from '../../utils/stringFormatter';
import { Table, Thead, Tbody,TFooter , Tr, Td, Th } from '@strapi/design-system/Table';

const HomePage = () => {
  const pgTables = useFetchPgMetadata()
  const [contents, setContents] = useState(undefined);
  const [collectionTypeLinks, setCollectionTypeLinks] = useState([]);

  // const match = useRouteMatch('/plugins/postgis/:uiid');
  let { uiid } = useParams();
  useEffect(() => {
    if (pgTables) {
      let collectionTypeLinks = Object.keys(pgTables.spatialTables).map(modelName => {
        return {
          title: toTitleCase(modelName.split('.').reverse()[0]),
          uid: modelName,
          to: `${pluginId}/${modelName}`
        }
      })
      setCollectionTypeLinks(collectionTypeLinks)
    }
  }, [pgTables])

  const renderTable= () => {
    const ROW_COUNT = 6;
    const COL_COUNT = 10;
    const entry = {
      cover: 'https://avatars.githubusercontent.com/u/3874873?v=4',
      description: 'Chez Léon is a human sized Parisian',
      category: 'French cuisine',
      contact: 'Leon Lafrite'
    };
    const entries = [];
  
    for (let i = 0; i < 5; i++) {
      entries.push({ ...entry,
        id: i
      });
    }
  
    return <Box padding={8} background="neutral100">
            <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
              <Thead>
                <Tr>
                  <Th>
                    <BaseCheckbox aria-label="Select all entries" />
                  </Th>
                  <Th action={<IconButton label="Sort on ID"  noBorder />}>
                    <Typography variant="sigma">ID</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">Cover</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">Description</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">Categories</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">Contact</Typography>
                  </Th>
                  <Th>
                    {/* <VisuallyHidden>Actions</VisuallyHidden> */}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {entries.map(entry => <Tr key={entry.id}>
                    <Td>
                      <BaseCheckbox aria-label={`Select ${entry.contact}`} />
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{entry.id}</Typography>
                    </Td>
                    <Td>
                      <Avatar src={entry.cover} alt={entry.contact} />
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{entry.description}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{entry.category}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{entry.contact}</Typography>
                    </Td>
                    <Td>
                      <Flex>
                        <IconButton onClick={() => console.log('edit')} label="Edit" noBorder  />
                        <Box paddingLeft={1}>
                          <IconButton onClick={() => console.log('delete')} label="Delete" noBorder  />
                        </Box>
                      </Flex>
                    </Td>
                  </Tr>)}
              </Tbody>
            </Table>
          </Box>;
  }
  

  return (
    <Layout sideNav={<LeftMenu collectionTypeLinks={collectionTypeLinks} />}>
      <Box background="neutral100">
        <BaseHeaderLayout sticky title="Restaurants" subtitle="36 entries found" as="h2" />
      </Box>
      <Allotment vertical>
        <Allotment.Pane snap >
          {uiid}
          {renderTable()}

        </Allotment.Pane>
        <Allotment.Pane  minSize={200} >

          <MainMap></MainMap>
        </Allotment.Pane>
      </Allotment>

    </Layout>
  );
};

export default memo(HomePage);
