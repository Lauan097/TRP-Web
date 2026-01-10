'use client'

import { Button } from '@/components/ui/button'; 
import { Checkbox } from '@/components/ui/checkbox'; 
import CustomBorderInput from '../CustomBorderInput';
import CustomBorderTextarea from '../CustomBorderTextarea';
import { ArrowUp, ArrowDown, Trash2, Plus } from 'lucide-react';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { LuOctagonAlert } from "react-icons/lu";

export type FieldObject = {
  id: string;
  name: string;
  value: string;
  inline: boolean;
};

interface EmbedFieldsProps {
  value: FieldObject[];
  onChange: (fields: FieldObject[]) => void;
  limits: {
    maxCount: number;
    name: number;
    value: number;
  };
  isSubmitted?: boolean;
  collapsedFields: Set<string>;
  onToggleCollapse: (collapsed: Set<string>) => void;
}

export default function EmbedFields({ 
  value: fields, 
  onChange, 
  limits, 
  isSubmitted,
  collapsedFields,
  onToggleCollapse
}: EmbedFieldsProps) {

  const toggleFieldVisibility = (fieldId: string) => {
    const newCollapsed = new Set(collapsedFields);
    if (newCollapsed.has(fieldId)) {
      newCollapsed.delete(fieldId);
    } else {
      newCollapsed.add(fieldId);
    }
    onToggleCollapse(newCollapsed);
  };

  const addField = () => {
    if (fields.length >= limits.maxCount) return;

    const newField: FieldObject = {
      id: crypto.randomUUID(), 
      name: '',
      value: '',
      inline: false,
    };
    onChange([...fields, newField]);
  };

  const deleteField = (id: string) => {
    onChange(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, prop: keyof FieldObject, newValue: string | boolean) => {
    onChange(
      fields.map(f => (f.id === id ? { ...f, [prop]: newValue } : f))
    );
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    const [movedField] = newFields.splice(index, 1);
    newFields.splice(targetIndex, 0, movedField);
    
    onChange(newFields);
  };

  const truncateText = (text: string, maxLength: number = 45) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {fields.map((field, index) => {
          const isNameEmpty = isSubmitted && !field.name;
          const isValueEmpty = isSubmitted && !field.value;
          const isCollapsed = collapsedFields.has(field.id);
          
          return (
            <div 
              key={field.id} 
              className="p-4 bg-[#1d1d1d] border border-gray-700 rounded-lg space-y-4"
            >
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-400">
                  <span className="md:hidden">FIELD #{index + 1}</span>
                  <span className="hidden md:inline">
                    FIELD #{index + 1}{field.name.trim() 
                      ? `ﾠ-ﾠ${truncateText(field.name)}` 
                      : (
                        <span className="inline-flex items-center ml-1">
                          <span className="text-gray-400">&nbsp;- &nbsp;</span>
                          <LuOctagonAlert className="text-red-400 mr-1" size={12} />
                          <span className="text-red-400">Vazio!</span>
                        </span>
                      )
                    }
                  </span>
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:bg-[#3d3d3d8e] hover:text-white cursor-pointer"
                    disabled={index === 0}
                    onClick={() => moveField(index, 'up')}
                    title="Mover para cima"
                  >
                    <ArrowUp size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:bg-[#3d3d3d8e] hover:text-white cursor-pointer"
                    disabled={index === fields.length - 1}
                    onClick={() => moveField(index, 'down')}
                    title="Mover para baixo"
                  >
                    <ArrowDown size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
                    onClick={() => deleteField(field.id)}
                    title="Excluir Field"
                  >
                    <Trash2 size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:bg-gray-500/20 hover:text-gray-300 cursor-pointer"
                    onClick={() => toggleFieldVisibility(field.id)}
                    title={isCollapsed ? "Mostrar Campo" : "Ocultar Campo"}
                  >
                    {isCollapsed ? <IoEye size={16} /> : <IoEyeOff size={16} />}
                  </Button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <hr className="w-full bg-gray-400 md:hidden" />
                    <div className="flex-1">
                      <CustomBorderInput
                        label={`Título (Name)${isNameEmpty ? ' - Obrigatório' : ''}`}
                        maxLength={limits.name}
                        value={field.name}
                        onChange={(e) => updateField(field.id, 'name', e.target.value)}
                        className={isNameEmpty ? 'border-red-500' : ''}
                      />
                    </div>
                    <div className="flex items-center space-x-2 shrink-0 border border-gray-500 rounded-md px-3 py-2 bg-[#1f1f1f]">
                      <Checkbox
                        id={`inline-${field.id}`}
                        checked={field.inline}
                        onCheckedChange={(checked: boolean | 'indeterminate') => updateField(field.id, 'inline', !!checked)}
                        className="data-[state=checked]:bg-blue-600 border-gray-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`inline-${field.id}`}
                        className="text-sm font-medium text-gray-300 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Inline
                      </label>
                    </div>
                  </div>
                  <CustomBorderTextarea
                    label={`Valor (Value)${isValueEmpty ? ' - Obrigatório' : ''}`}
                    maxLength={limits.value}
                    value={field.value}
                    onChange={(e) => updateField(field.id, 'value', e.target.value)}
                    onMentionInsert={(newValue: string) => updateField(field.id, 'value', newValue)}
                    className={isValueEmpty ? 'border-red-500 min-h-80px' : 'min-h-80px'}
                    placeholder='Suporta Markdown'
                    menuMention={true} 
                  />
                </div>
              )}

            </div>
          )
        })}
      </div>

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          className="bg-gray-700 hover:bg-gray-600 border-gray-600 cursor-pointer"
          onClick={addField}
          disabled={fields.length >= limits.maxCount}
        >
          <Plus size={16} className="mr-2" />
          Adicionar Field
        </Button>
        <span className="text-sm font-medium text-gray-400 bg-[#1d1d1d] border border-gray-700 rounded-lg px-2 py-1">
          {fields.length} / {limits.maxCount}
        </span>
      </div>
    </div>
  );
}