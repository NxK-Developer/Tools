import React from 'react';
import {
  ImageDown,
  Scaling,
  FileText,
  CaseSensitive,
  QrCode,
  Percent,
  FileOutput,
  Files,
  Braces,
  Image,
  Type,
  Calculator,
  FileStack,
  Code2,
  Wrench,
} from 'lucide-react';
import { ToolIconId, ToolCategoryId } from '../utilities/toolRegistry';

interface IconResolverProps {
  icon: ToolIconId | string;
  className?: string;
}

export function IconResolver({ icon, className = 'w-5 h-5' }: IconResolverProps) {
  switch (icon) {
    case 'image-down':
      return <ImageDown className={className} aria-hidden="true" />;
    case 'scaling':
      return <Scaling className={className} aria-hidden="true" />;
    case 'file-text':
      return <FileText className={className} aria-hidden="true" />;
    case 'case-sensitive':
      return <CaseSensitive className={className} aria-hidden="true" />;
    case 'qr-code':
      return <QrCode className={className} aria-hidden="true" />;
    case 'percent':
      return <Percent className={className} aria-hidden="true" />;
    case 'file-Output':
      return <FileOutput className={className} aria-hidden="true" />;
    case 'files':
      return <Files className={className} aria-hidden="true" />;
    case 'braces':
      return <Braces className={className} aria-hidden="true" />;
    case 'image':
      return <Image className={className} aria-hidden="true" />;
    case 'type':
      return <Type className={className} aria-hidden="true" />;
    case 'calculator':
      return <Calculator className={className} aria-hidden="true" />;
    case 'file-stack':
      return <FileStack className={className} aria-hidden="true" />;
    case 'code-2':
      return <Code2 className={className} aria-hidden="true" />;
    default:
      return <Wrench className={className} aria-hidden="true" />;
  }
}

const CATEGORY_TILE_STYLES: Record<ToolCategoryId, string> = {
  [ToolCategoryId.IMAGE]:
    'bg-blue-500/12 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-400/25',
  [ToolCategoryId.PDF]:
    'bg-rose-500/12 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-400/25',
  [ToolCategoryId.TEXT]:
    'bg-violet-500/12 text-violet-600 border-violet-500/20 dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-400/25',
  [ToolCategoryId.QR]:
    'bg-emerald-500/12 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-400/25',
  [ToolCategoryId.CALCULATOR]:
    'bg-amber-500/12 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-400/25',
  [ToolCategoryId.DEVELOPER]:
    'bg-sky-500/12 text-sky-600 border-sky-500/20 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-400/25',
};

interface CategoryIconTileProps {
  icon: ToolIconId | string;
  category: ToolCategoryId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CategoryIconTile({
  icon,
  category,
  size = 'md',
  className = '',
}: CategoryIconTileProps) {
  const colorStyle =
    CATEGORY_TILE_STYLES[category] ??
    'bg-blue-500/12 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400';

  const dimensions =
    size === 'sm'
      ? 'h-9 w-9 rounded-xl'
      : size === 'lg'
      ? 'h-12 w-12 rounded-2xl'
      : 'h-11 w-11 rounded-xl';

  const iconSize =
    size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div
      className={`flex shrink-0 items-center justify-center border transition-transform duration-200 group-hover:scale-105 ${dimensions} ${colorStyle} ${className}`}
    >
      <IconResolver icon={icon} className={iconSize} />
    </div>
  );
}
