---
title: Bash Arrays
---

## Creating Arrays

The most common way to define an array in bash is with the simple `a=()` syntax. This can be done on a single line, or it can be split over multiple lines.

```bash
one_line=(foo bar baz)
multi_line=(
    foo
    bar
    baz
)
```

Bash also allows you to define elements at specific indexes. You are not required to define the indexes in order. You can leave gaps to create a *sparse array* which can be useful if you need insert items in between the initial items later on.

```bash
using_indexes=([0]=foo [1]=bar [2]=baz)
sparse_array=([0]=foo [20]=bar [30]=baz)
```

You can also create an array by splitting data with `IFS`. `IFS`, or Internal Field Separator, tells bash what characters should be used to split up a string. We can change it to our delimiter and use it along with `read` to split a string into an array.

```bash
IFS=. read -ra dot_delimited <<< "foo.bar.baz"
IFS=, read -ra comma_delimited <<< "foo,bar,baz"
IFS=" " read -ra space_delimited <<< "foo bar baz"
```

## Editing Arrays

When adding to an array, you can append data to the end of the array or you can set values at specific indexes.

```bash
array+=(foo)
array[10]=foo
```

If you need to delete something from an array, you can use `unset`. Note that the reference to the array should be quoted to prevent bash from treating the square brackets as a glob pattern.

```bash
unset 'array[2]'
```

## Expanding Arrays

Here is a basic overview of the different ways to expand arrays:

```bash
"$array"        # If you expand like a variable, you get the first element
"${array[@]}"   # Expand all individual elements of the array
"${array[*]}"   # Combine the array elements into a single string
"${array[0]}"   # Get the array element at a specific index
"${!array[@]}"  # Expand the indexes of the elements in the array
"${#array[@]}"  # Get the length of the array
"${#array[1]}"  # Get the length of a specific element in the array

# Get the first 2 elements of the array.
# array=(foo bar baz) would become (foo bar)
"${array[@]:2}"

# Get the last 2 elements of the array.
# The space is required in front of a negative value.
# array=(foo bar baz) would become (bar baz)
"${array[@]: -2}"

# Get a slice of the array containing 2 elements, starting at index 3
# array=(a b c d e f) would become (d e)
"${array[@]:3:2}"
```

The `[*]` syntax is a bit special. While it does combine the elements of the array into a single string, you can actually control the character that's used to combine them using bash's `IFS` variable. The first character of `IFS` is what will be used to combine the elements. The default value of `IFS` is a space, tab, and newline

:::caution
Internal Bash variables like `IFS` should be always be changed in a subshell rather than the main shell process when possible. A lot of commands rely on `IFS` to determine how they behave, and changing it in the main shell can cause weird and unexpected behavior. In the example below, the `( )` subshell syntax is used for this.
:::

```bash
# The default value of IFS is space, tab, and newline so by default this will
# combine with a space. By overriding IFS, we can change the character used
# to combine the elements.
words=(foo bar baz)
echo "${words[*]}"          # foo bar baz
(IFS=,; echo "${words[*]}") # foo,bar,baz

# Being able to change to character can make it much easier to see the
# individual elements when they contain spaces.
names=("John Doe" "Jane Doe")
echo "${names[*]}"          # John Doe Jane Doe
(IFS=,; echo "${names[*]}") # John Doe,Jane Doe
```
