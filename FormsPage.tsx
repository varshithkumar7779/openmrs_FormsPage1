import { useConfig, useSession } from '@openmrs/esm-framework';
import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@carbon/react';
import React, { useMemo } from 'react';
import { type Config } from '../config-schema';
import { useGetAllForms } from '../hooks';
import FormsTable from './forms-table';
import styles from './styles.scss';
import { useTranslation } from 'react-i18next';
import { fdeWorkflowStorageName, fdeWorkflowStorageVersion } from '../context/FormWorkflowReducer';
import { fdeGroupWorkflowStorageName, fdeGroupWorkflowStorageVersion } from '../context/GroupFormWorkflowReducer';

interface Form {
  uuid: string;
  display?: string;
  name?: string;
  encounterType: {
    editPrivilege: {
      display: string;
    };
  };
}

interface FormCategory {
  name: string;
  forms: { formUUID: string }[];
}

interface FormsPageProps {
  config: Config;
}

export const getFormPermissions = (forms: Form[]) => {
  const output: Record<string, string[]> = {};
  forms?.forEach((form) => {
    const permission = form.encounterType.editPrivilege.display;
    output[permission] = [...(output[permission] || []), form.display || form.name];
  });
  return output;
};

const prepareRowsForTable = (rawFormData: Form[]) => {
  if (!rawFormData) return null;
  return rawFormData.map((form) => ({
    ...form,
    id: form.uuid,
    display: form.display || form.name,
  }));
};

const FormsPage: React.FC<FormsPageProps> = () => {
  const config = useConfig<Config>();
  const { t } = useTranslation();
  const { formCategories, formCategoriesToShow } = config;
  const { forms, isLoading, error } = useGetAllForms();
  const { user } = useSession();

  const cleanRows = useMemo(() => prepareRowsForTable(forms), [forms]);

  const savedFormsData = localStorage.getItem(`${fdeWorkflowStorageName}:${user?.uuid}`);
  const savedGroupFormsData = localStorage.getItem(`${fdeGroupWorkflowStorageName}:${user?.uuid}`);

  const activeForms: string[] = [];
  const activeGroupForms: string[] = [];

  if (savedFormsData && JSON.parse(savedFormsData)?.['_storageVersion'] === fdeWorkflowStorageVersion) {
    Object.entries(JSON.parse(savedFormsData).forms).forEach(([formUuid, form]) => {
      if (form.workflowState) activeForms.push(formUuid);
    });
  }

  if (savedGroupFormsData && JSON.parse(savedGroupFormsData)?.['_storageVersion'] === fdeGroupWorkflowStorageVersion) {
    Object.entries(JSON.parse(savedGroupFormsData).forms).forEach(([formUuid, form]) => {
      if (form.workflowState) activeGroupForms.push(formUuid);
    });
  }

  const categoryRows = useMemo(() => {
    return formCategoriesToShow.map((name) => {
      const category = formCategories.find((category) => category.name === name);
      let rows: Form[] = [];
      if (category && cleanRows && cleanRows.length) {
        const uuids = category.forms?.map((form) => form.formUUID);
        rows = cleanRows
          .filter((row) => uuids.includes(row.uuid))
          .sort((a, b) => uuids.indexOf(a.uuid) - uuids.indexOf(b.uuid));
      }
      return { name, rows };
    });
  }, [formCategories, formCategoriesToShow, cleanRows]);

  return (
    <div className={styles.mainContent}>
      <h3 className={styles.pageTitle}>{t('fastDataEntry', 'Fast Data Entry')}</h3>
      <Tabs>
        <TabList>
          <Tab label={t('allForms', 'All Forms')}>
            {`${t('allForms', 'All Forms')} (${cleanRows ? cleanRows.length : '??'})`}
          </Tab>
          {categoryRows.map((category, index) => (
            <Tab label={category.name} key={index}>
              {`${category.name} (${category.rows.length})`}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormsTable rows={cleanRows} {...{ error, isLoading, activeForms, activeGroupForms }} />
          </TabPanel>
          {categoryRows.map((category, index) => (
            <TabPanel key={index}>
              <FormsTable rows={category.rows} {...{ error, isLoading, activeForms, activeGroupForms }} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </div>
  );
};

export default FormsPage;
