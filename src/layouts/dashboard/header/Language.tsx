import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import LanguageIcon from '@mui/icons-material/Language';
import CustomPopover from '../../../components/custom-popover/custom-popover';
import usePopover from '../../../components/custom-popover/use-popover';
import MenuItem from '@mui/material/MenuItem';
import i18n from '../../../i18n';
import { supabase } from '../../../supabase';


interface Language {
  label: string;
  value: string;
}

const allLangs: Language[] = [
  {
    label: i18n.t('header.language-switcher-label-en'),
    value: 'en',
  },
  {
    label: i18n.t('header.language-switcher-label-de'),
    value: 'de',
  },
];

export default function LanguagePopover() {
  const popover = usePopover();
  const [currentLang, setCurrentLang] = useState<Language>(allLangs[0]);

  useEffect(() => {
    const handleLanguageChange = () => {
      const currentLanguage = i18n.language;
      const lang = allLangs.find(lang => lang.value === currentLanguage) || allLangs[0];
      setCurrentLang(lang);
    };

    i18n.on('languageChanged', handleLanguageChange);

    const fetchLanguagePreference = async () => {
      if (!supabase) {
        console.error("Supabase client is not available.");
        return;
      }

      const { data: authResponse, error: authError } = await supabase.auth.getUser();
      if (authError) {
        console.error("Error fetching user session:", authError.message);
        return;
      }

      const authUserID = authResponse?.user?.id;

      const { data, error } = await supabase
        .from("User")
        .select("language")
        .eq("auth_id", authUserID)
        .single();

      if (error) {
        console.error("Error fetching user language preference:", error.message);
        return;
      }

      const preferredLanguage = data?.language;

      if (preferredLanguage) {
        i18n.changeLanguage(preferredLanguage);
      }
    };

    fetchLanguagePreference();

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const handleChangeLang = async (value: string, index: number) => {
    i18n.changeLanguage(value);
    setCurrentLang(allLangs[index]);
    localStorage.setItem('preferredLanguage', value);

    if (!supabase) {
      console.error("Supabase client is not available.");
      return;
    }

    const { data: authResponse, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error("Error fetching user session:", authError.message);
      return;
    }

    const authUserID = authResponse?.user?.id;

    const { data: userIdData, error: userIdError } = await supabase
      .from("User")
      .select("user_id")
      .eq("auth_id", authUserID)
      .single();

    if (userIdError) {
      console.error("Error fetching user ID:", userIdError.message);
      return;
    }

    const userId = userIdData?.user_id;

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    const { error: updateError } = await supabase
      .from("User")
      .update({ language: value })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating user language preference:", updateError.message);
    }
    // Close the popover after language is selected
    popover.onClose();
  };

  return (
    <>
      <IconButton
        component={m.button}
        onClick={popover.onOpen}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <LanguageIcon />
        <Typography className="language-switcher-label" variant="body2" sx={{ fontSize: 10, marginLeft: 1 }}>
          {currentLang.label.slice(0, 2).toUpperCase()}
        </Typography>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {allLangs.map((option, index) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang.value}
            onClick={() => handleChangeLang(option.value, index)}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
