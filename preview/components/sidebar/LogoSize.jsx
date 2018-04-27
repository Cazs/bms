// Libs
import React from 'react';
import PropTypes from 'prop-types';
import { Section, Label, Range } from '../shared';

function LogoSize({ t, logoSize, handleInputChange }) {
  return (
    <Section>
      <Label>
        {t('preview:sidebar:logoSize')}
      </Label>
      <Range
        name="logoSize"
        type="range"
        min="5"
        max="50"
        step="2.5"
        value={logoSize}
        onChange={handleInputChange}
      />
    </Section>
  );
}

LogoSize.propTypes =
{
  logoSize: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default LogoSize;
