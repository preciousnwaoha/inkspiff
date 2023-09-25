import { TableType, CodeType, ListType, SectionType } from "@/types/editor"

export const createTable = (headers: string[]) => {
    let tableStr = "|"

    headers.forEach(head => {
        tableStr += ` ${head} |`
    })
    tableStr += `
    |`
    headers.forEach(head => {
        tableStr += ` --- |`
    })
    tableStr += `
    |`
    headers.forEach(head => {
        tableStr += `  |`
    })

    return {
        markdown: tableStr,
        size: [2, headers.length]
    }
}

export const addTableRow = (table: TableType) => {

}

export const addTableColumn = (table: TableType) => {

}

export const delTableRow = (table: TableType) => {

}

export const delTableColumn = (table: TableType) => {

}

export const insertTableElement = (cell: [number, number]) => {

}

export const tableInHTML = (table: TableType) => {

}


export const addCode = (code: CodeType) => {
    return `\`\`\`${code.lang}
    ${code.text}
    \`\`\``
}

/**LIST */

// export const createList = (list: ListType) => {
//     const {items, type} = list
//     str = ""
//     list.items.forEach(item => {
//         if ()
//     })
// }

export const uid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

export  const setCaretToEnd = (element: HTMLElement) => {
    const range = document.createRange();
    
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
  
    selection!.removeAllRanges();
    selection!.addRange(range);
    element.focus();
  };

export const getCaretCoordinates = () => {
    let x: number | null = null;
    let y: number | null = null;
    const selection = window.getSelection();
    if (selection!.rangeCount !== 0) {
      const range = selection!.getRangeAt(0).cloneRange();
      range.collapse(false);
      const rect = range.getClientRects()[0];
      if (rect) {
        x = rect.left;
        y = rect.top;
      }
    }
    return { x: x, y: y };
  };

  
interface Block {
  id: string;
  html: string;
  tag: string;
}

  export const tagToMarkdown = (block: Block) => {
    const  {html, tag, id} = block
    switch (tag) {
      case 'p':
        return html;
      
      case 'h1':
        return `# ${html}`;

      case 'h2':
        return `## ${html}`;

      case 'h3':
        return `### ${html}`;

      case 'h4':
        return `#### ${html}`;

      case 'h5':
        return `##### ${html}`;

      case 'h6':
        return `###### ${html}`;

      case 'h6':
        return `###### ${html}`;

      case 'code':
        return `\`\`\` 
        ${html}
        \`\`\``;
      
    }
  }


  export const blocksToMarkdown = () => {
    
  }

  export function removeLastWord(s: string): [string, string] {
    const words = s.trim().split(' ');
    const removedWord = words.pop() || '';
    const remainingText = words.join(' ');
    return [remainingText, removedWord];
  }


export function enterableBlock(html: string): boolean {
  const ENTERABLE_BLOCKS_REGEXS = [
    /\|*\|*/,
    // /\`\`\`\n*\`\`\`/,
  ]

  let isEnterable = false
  for (let reg of ENTERABLE_BLOCKS_REGEXS) {
    if (reg.test(html)) {
      isEnterable = true;
      break;
    }
  }

  return isEnterable
}

export function extractTableCellContents(markdownTableRow: string): string[] {
  // Remove leading and trailing pipes, then split the row by pipe character
  const cells = markdownTableRow.trim().slice(1, -1).split('|').map(cell => cell.trim());

  // Filter out empty cells (between consecutive pipe characters)
  const cellContents: string[] = cells.filter(cell => cell !== "");

  return cellContents;
}



export const splitIntoBlocks = (cnt: string) => {

  type BlockType = {
    id: string
    tag: string,
    type: number,
    content: string[]
  }

  const blocks: BlockType[] = []

  const eachLine = cnt.split("\n")

  let prevStr: string = ""
  let prevBlock: BlockType

  eachLine.forEach((str, index) => {
    
    let isNewBlock: boolean = false

    if (str.trim() === "") {
      return
    }

    // Declare regexes
    const markdownHeadingRegex: RegExp = /^(#+)\s+(.*)/;
    const markdownTableStartRegex: RegExp = /^\s*\|.*\|\s*$/;
    const markdownListItemRegex: RegExp = /^(\s*[-+*]|\s*\d+\.)\s+/;
    const markdoenImageRegex: RegExp = /^/
    


    if (markdownHeadingRegex.test(str)) {
      isNewBlock = true
      const headingSignal = str.split(" ")[0]
      const headingType = headingSignal.length
      
      const newBlock = {
        id: uid(),
        tag: "heading",
        type: headingType,
        content: [str.replace(/^(#+)\s+/, "")],
      }

      prevStr = str
      prevBlock = newBlock
      blocks.push(newBlock)
    } else if (markdownTableStartRegex.test(str)) { // Is a table start
      const cellContents: string[] = extractTableCellContents(str)

      if (prevBlock.tag === "table") {
        blocks[blocks.length - 1].content.push(cellContents.join(","))

        prevStr = str
        prevBlock = blocks[blocks.length - 1]
      } else {
        const newBlock = {
          id: uid(),
          tag: "table",
          type: 1, // normal,
          content: [cellContents.join(",")],
        }
    
        prevStr = str
        prevBlock = newBlock
        blocks.push(newBlock)
      } 
      
    } else if (markdownListItemRegex.test(str)) { // Is a list item
      const listItemType = str.trim().split(" ")[0]

      enum MarkdownListItemType {
        Unordered = "unordered",
        Ordered = "ordered",
        Task = "task",
        NotAListItem = "not_a_list_item",
      }
      const markdownListItemIdentifiers = {
        [MarkdownListItemType.Unordered]: /^\s*[-+*]\s+/,
        [MarkdownListItemType.Ordered]: /^\s*\d+\.\s+/,
        [MarkdownListItemType.Task]: /^\s*-\s+\[[xX ]\]\s+/,
      };
    
      
      const listContent = [str]

      const newBlock = {
        id: uid(),
        tag: "list",
        type: 1,
        content: listContent,
      }

      prevStr = str
      prevBlock = newBlock
      blocks.push(newBlock)
    } else {
      const newBlock = {
        id: uid(),
        tag: "div",
        type: 1,
        content: [str],
      }

      prevStr = str
      prevBlock = newBlock
      blocks.push(newBlock)
    }

  })

    return blocks

}

function shortenStringWithDots(inputString: string, x: number): string {
  if (x <= 0 || inputString.length <= x) {
    return inputString.toLowerCase();
  }

  const partOfTheString = inputString.slice(0, x).toLowerCase();
  return `${partOfTheString}...`;
}


export const splitIntoSections = (cnt: string): SectionType[] => {

  const sections: SectionType[] = []
  
  const eachLine = cnt.split("\n")

  eachLine.forEach(str => {
      let newSection = false
      // TODO: uses one regex
      if (str.trim()[0] === "#") {
         newSection = true
      }

      if (newSection) {
          sections.push({
              id: uid(),
              name: shortenStringWithDots(str, 15),
              content: `${str}\n`,
          })
      } else {
          if (sections.length <= 0) { // if there is no section
              if (str.trim() !== "") {
                sections.push({
                  id: uid(),
                  name: "Sub section",
                  content: `${str}\n`,
              })
              }
              
          } else { // if there is at least one section
              sections[sections.length - 1] = {
                  ...sections[sections.length - 1],
                  content: sections[sections.length - 1].content + `${str}\n`
              }
          }
         
      }
  })
  
  return sections
}

export const getSectionFromLine  = (lineNumber: number, sections: SectionType[]) => {
  let totalLines = 0;
  for (let section of sections) {
    let sectionLines = section.content.split("\n").length
    totalLines + sectionLines

    if (lineNumber <= totalLines) {
      return section
    }
  }

  return sections[sections.length - 1]
}