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
import { ToolIconId } from '../utilities/toolRegistry';

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
