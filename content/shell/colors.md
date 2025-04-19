---
title: Shell Colors
---


## Printing Colored Text

When printing colored text, make sure you end messages with the 'reset' escape sequence to stop the color from continuing past the message and affecting future messages.

```bash
color_msg() {
    local color="$1"
    local msg="$2"
    printf "%b%s%b\n" "$color" "$msg" "$RESET"
}
```

You can also use `echo` to print colors, but you need to use the `-e` flag to set the command to escape backslashes.

```bash
color_msg() {
    local color="$1"
    local msg="$2"
    echo -e "${color}${msg}${RESET}"
}
```

## Escape Sequences

```bash
# Reset color back to normal
RESET="\033[0m"

# Standard Colors
BLACK="\033[0;30m"
BLUE="\033[0;34m"
BROWN="\033[0;33m"
CYAN="\033[0;36m"
DARK_GRAY="\033[1;30m"
GREEN="\033[0;32m"
PURPLE="\033[0;35m"
RED="\033[0;31m"
YELLOW="\033[1;33m"

# Light variants
LIGHT_BLUE="\033[1;34m"
LIGHT_CYAN="\033[1;36m"
LIGHT_GRAY="\033[0;37m"
LIGHT_GREEN="\033[1;32m"
LIGHT_PURPLE="\033[1;35m"
LIGHT_WHITE="\033[1;37m"

# Text effects
BLINK="\033[5m"
BOLD="\033[1m"
CROSSED="\033[9m"
FAINT="\033[2m"
ITALIC="\033[3m"
NEGATIVE="\033[7m"
UNDERLINE="\033[4m"

# Effect/Color Combinations
BOLD_BLACK='\033[1;30m'
BOLD_BLUE='\033[1;34m'
BOLD_CYAN='\033[1;36m'
BOLD_GREEN='\033[1;32m'
BOLD_PURPLE='\033[1;35m'
BOLD_RED='\033[1;31m'
BOLD_WHITE='\033[1;37m'
BOLD_YELLOW='\033[1;33m'

UNDERLINE_BLACK='\033[4;30m'
UNDERLINE_BLUE='\033[4;34m'
UNDERLINE_CYAN='\033[4;36m'
UNDERLINE_GREEN='\033[4;32m'
UNDERLINE_PURPLE='\033[4;35m'
UNDERLINE_RED='\033[4;31m'
UNDERLINE_WHITE='\033[4;37m'
UNDERLINE_YELLOW='\033[4;33m'

# High Intensity
HI_BLACK='\033[0;90m'
HI_BLUE='\033[0;94m'
HI_CYAN='\033[0;96m'
HI_GREEN='\033[0;92m'
HI_PURPLE='\033[0;95m'
HI_RED='\033[0;91m'
HI_WHITE='\033[0;97m'
HI_YELLOW='\033[0;93m'

# Bold High Intensity
BOLD_HI_BLACK='\033[1;90m'
BOLD_HI_BLUE='\033[1;94m'
BOLD_HI_CYAN='\033[1;96m'
BOLD_HI_GREEN='\033[1;92m'
BOLD_HI_PURPLE='\033[1;95m'
BOLD_HI_RED='\033[1;91m'
BOLD_HI_WHITE='\033[1;97m'
BOLD_HI_YELLOW='\033[1;93m'

# Backgrounds
BACKGROUND_BLACK='\033[40m'
BACKGROUND_BLUE='\033[44m'
BACKGROUND_CYAN='\033[46m'
BACKGROUND_GREEN='\033[42m'
BACKGROUND_PURPLE='\033[45m'
BACKGROUND_RED='\033[41m'
BACKGROUND_WHITE='\033[47m'
BACKGROUND_YELLOW='\033[43m'

# High Intensity backgrounds
BACKGROUND_HI_BLACK='\033[0;100m'
BACKGROUND_HI_BLUE='\033[0;104m'
BACKGROUND_HI_CYAN='\033[0;106m'
BACKGROUND_HI_GREEN='\033[0;102m'
BACKGROUND_HI_PURPLE='\033[0;105m'
BACKGROUND_HI_RED='\033[0;101m'
BACKGROUND_HI_WHITE='\033[0;107m'
BACKGROUND_HI_YELLOW='\033[0;103m'
```
