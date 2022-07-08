import { createType } from 'typea';
import date from 'typea/date.js';
import snumber from 'typea/snumber.js';
import email from "typea/email.js";
import mobilePhone from "typea/mobilePhone.js";

createType('date', date);
createType('email', email);
createType('mobilePhone', mobilePhone);
createType('snumber', snumber);
