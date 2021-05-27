import { Popconfirm, Button, Typography } from 'antd';
import { useContext, useState } from 'react';
import { AlertMessageContext } from '../../utils/alert-message-context';

import { SELF_DESTRUCT, fetchData } from '../../utils/apis';
import { RESET_TIMEOUT } from '../../utils/config-constants';
import {
  createInputStatus,
  STATUS_ERROR,
  STATUS_PROCESSING,
  STATUS_SUCCESS,
} from '../../utils/input-statuses';
import FormStatusIndicator from './form-status-indicator';

export default function SelfDestruct() {
  const { setMessage } = useContext(AlertMessageContext);

  const [submitStatus, setSubmitStatus] = useState(null);
  let resetTimer = null;
  const resetStates = () => {
    setSubmitStatus(null);
    resetTimer = null;
    clearTimeout(resetTimer);
  };

  const resetDirectoryRegistration = async () => {
    setSubmitStatus(createInputStatus(STATUS_PROCESSING));
    try {
      await fetchData(SELF_DESTRUCT);
      setMessage('');
      setSubmitStatus(createInputStatus(STATUS_SUCCESS));
      resetTimer = setTimeout(resetStates, RESET_TIMEOUT);
    } catch (error) {
      setSubmitStatus(createInputStatus(STATUS_ERROR, `There was an error: ${error}`));
      resetTimer = setTimeout(resetStates, RESET_TIMEOUT);
    }
  };

  return (
    <>
      <Typography.Title level={3} className="section-title">
        Self-Destruct
      </Typography.Title>
      <p className="description">
        Typically server applications like Owncast will be configured to run as services (e.g. Systemd, openrc, launchd, Windows Service) 
        or as Linux containers (e.g. Docker containers) that automatically restart when the process ends. 
        Unless you are running Owncast manually from the command line, this should restart your Owncast server.
      </p>

      <Popconfirm
        placement="topLeft"
        title="Are you sure you want to tell the Owncast process to exit?"
        onConfirm={resetDirectoryRegistration}
        okText="Yes"
        cancelText="No"
      >
        <Button type="primary">Self-Destruct</Button>
      </Popconfirm>
      <p>
        <FormStatusIndicator status={submitStatus} />
      </p>
    </>
  );
}
