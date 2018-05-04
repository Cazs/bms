// Helpers
import * as SessionManager from '../helpers/SessionManager';
import Log, { formatDate } from '../helpers/Logger';

export const newMaterial = () =>
{
  const current_date = new Date();
                            
  return {
    brand_name: '',
    resource_description: '',
    resource_code: '',
    resource_type: 'hardware',
    resource_value: 0,
    quantity: 1,
    unit: 'ea',
    acquired_date: formatDate(current_date),
    date_acquired: current_date.getTime(),
    date_exhausted: 0,
    exhausted_date: '1970-01-01',
    supplier_id: '',
    part_number: '',
    creator_name: SessionManager.session_usr.name,
    creator: SessionManager.session_usr.usr,
    creator_employee: SessionManager.session_usr,
    logged_date: formatDate(current_date),
    date_logged: current_date.getTime()
  }
}

export default newMaterial;